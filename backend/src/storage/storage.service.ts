import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import {
  FileMetadata,
  FileMetadataDocument,
  FileVisibility,
} from './schemas/file-metadata.schema';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { S3_CLIENT, DEFAULT_BUCKET } from './config/s3.config';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface DownloadResult {
  stream: NodeJS.ReadableStream;
  metadata: FileMetadata;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
    @InjectModel(FileMetadata.name)
    private readonly fileMetadataModel: Model<FileMetadataDocument>,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>(
      'SEAWEEDFS_BUCKET',
      DEFAULT_BUCKET,
    );
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket '${this.bucket}' exists`);
    } catch (error) {
      if ((error as { name?: string }).name === 'NotFound') {
        this.logger.log(`Creating bucket '${this.bucket}'...`);
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
        this.logger.log(`Bucket '${this.bucket}' created`);
      } else {
        this.logger.warn(`Could not verify bucket: ${error}`);
      }
    }
  }

  private generateStorageKey(originalName: string, folder?: string): string {
    const ext = originalName.includes('.')
      ? originalName.substring(originalName.lastIndexOf('.'))
      : '';
    const uuid = uuidv4();
    const prefix = folder ? `${folder}/` : '';
    return `${prefix}${uuid}${ext}`;
  }

  async upload(
    file: UploadedFile,
    uploadDto: UploadFileDto,
    userId: string,
    userEmail: string,
  ): Promise<FileMetadata> {
    const storageKey = this.generateStorageKey(
      file.originalname,
      uploadDto.folder,
    );

    // Upload to SeaweedFS
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
        },
      }),
    );

    // Save metadata to MongoDB
    const metadata = new this.fileMetadataModel({
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      visibility: uploadDto.visibility ?? FileVisibility.PRIVATE,
      uploadedBy: userId,
      uploadedByEmail: userEmail,
      description: uploadDto.description,
      tags: uploadDto.tags ?? [],
      folder: uploadDto.folder,
    });

    return metadata.save();
  }

  async findById(
    id: string,
    userId?: string,
    checkOwnership = true,
  ): Promise<FileMetadata> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    // Check access: public files can be accessed by anyone
    // Private files require ownership check
    if (
      checkOwnership &&
      metadata.visibility === FileVisibility.PRIVATE &&
      metadata.uploadedBy !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return metadata;
  }

  async download(id: string, userId?: string): Promise<DownloadResult> {
    const metadata = await this.findById(id, userId);

    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: metadata.storageKey,
      }),
    );

    if (!response.Body) {
      throw new NotFoundException('File content not found');
    }

    // Convert to Node.js readable stream
    const stream = response.Body as NodeJS.ReadableStream;

    return {
      stream,
      metadata,
    };
  }

  async getPresignedUrl(
    id: string,
    userId?: string,
    expiresIn = 3600,
  ): Promise<string> {
    const metadata = await this.findById(id, userId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: metadata.storageKey,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async findAll(
    query: FileQueryDto,
    userId?: string,
  ): Promise<{
    files: FileMetadata[];
    total: number;
  }> {
    const filter: Record<string, unknown> = {};

    // Non-authenticated users can only see public files
    if (!userId) {
      filter.visibility = FileVisibility.PUBLIC;
    } else if (query.visibility) {
      // Authenticated users can filter by visibility
      // But can only see their own private files
      if (query.visibility === FileVisibility.PRIVATE) {
        filter.visibility = FileVisibility.PRIVATE;
        filter.uploadedBy = userId;
      } else {
        filter.visibility = FileVisibility.PUBLIC;
      }
    } else {
      // Default: show user's files + all public files
      filter.$or = [
        { uploadedBy: userId },
        { visibility: FileVisibility.PUBLIC },
      ];
    }

    if (query.folder) {
      filter.folder = query.folder;
    }

    if (query.tags && query.tags.length > 0) {
      filter.tags = { $all: query.tags };
    }

    if (query.search) {
      const searchFilter = {
        $or: [
          { originalName: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ],
      };
      // Merge search filter with existing filter
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, searchFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    const [files, total] = await Promise.all([
      this.fileMetadataModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.offset ?? 0)
        .limit(query.limit ?? 20)
        .exec(),
      this.fileMetadataModel.countDocuments(filter).exec(),
    ]);

    return { files, total };
  }

  async update(
    id: string,
    updateDto: UpdateFileDto,
    userId: string,
  ): Promise<FileMetadata> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    if (metadata.uploadedBy !== userId) {
      throw new ForbiddenException('Only the file owner can update metadata');
    }

    // Update only provided fields
    if (updateDto.description !== undefined) {
      metadata.description = updateDto.description;
    }
    if (updateDto.tags !== undefined) {
      metadata.tags = updateDto.tags;
    }
    if (updateDto.folder !== undefined) {
      metadata.folder = updateDto.folder;
    }
    if (updateDto.visibility !== undefined) {
      metadata.visibility = updateDto.visibility;
    }

    return metadata.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    if (metadata.uploadedBy !== userId) {
      throw new ForbiddenException('Only the file owner can delete this file');
    }

    // Delete from SeaweedFS
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: metadata.storageKey,
      }),
    );

    // Delete metadata from MongoDB
    await this.fileMetadataModel.findByIdAndDelete(id).exec();
  }

  async findByUser(userId: string, limit = 50): Promise<FileMetadata[]> {
    return this.fileMetadataModel
      .find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
