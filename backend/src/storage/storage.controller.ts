import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import {
  StorageService,
  UploadedFile as IUploadedFile,
} from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { FileVisibility } from './schemas/file-metadata.schema';

// User type from JWT payload (matches existing pattern)
interface JwtUser {
  id: string;
  email: string;
  roles: string[];
}

@Controller('files')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
    @CurrentUser() user: JwtUser,
  ) {
    const uploadedFile: IUploadedFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    return this.storageService.upload(
      uploadedFile,
      uploadDto,
      user.id,
      user.email,
    );
  }

  @Get()
  async findAll(
    @Query() query: FileQueryDto,
    @CurrentUser() user: JwtUser | null,
  ) {
    return this.storageService.findAll(query, user?.id);
  }

  @Public()
  @Get('public')
  async findPublic(@Query() query: FileQueryDto) {
    // Force public visibility for unauthenticated access
    query.visibility = FileVisibility.PUBLIC;
    return this.storageService.findAll(query);
  }

  @Get('user/my-files')
  async getMyFiles(@CurrentUser() user: JwtUser) {
    return this.storageService.findByUser(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser | null,
  ) {
    return this.storageService.findById(id, user?.id);
  }

  @Public()
  @Get(':id/public')
  async findOnePublic(@Param('id') id: string) {
    // Only returns if file is public
    return this.storageService.findById(id, undefined, true);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser | null,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.storageService.download(id, user?.id);

    res.set({
      'Content-Type': result.metadata.mimeType,
      'Content-Disposition': `attachment; filename="${result.metadata.originalName}"`,
      'Content-Length': result.metadata.size,
    });

    const nodeStream = Readable.fromWeb(result.stream as unknown as import('stream/web').ReadableStream);
    return new StreamableFile(nodeStream);
  }

  @Public()
  @Get(':id/download/public')
  async downloadPublic(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.storageService.download(id, undefined);

    res.set({
      'Content-Type': result.metadata.mimeType,
      'Content-Disposition': `attachment; filename="${result.metadata.originalName}"`,
      'Content-Length': result.metadata.size,
    });

    const nodeStream = Readable.fromWeb(result.stream as unknown as import('stream/web').ReadableStream);
    return new StreamableFile(nodeStream);
  }

  @Get(':id/url')
  async getPresignedUrl(
    @Param('id') id: string,
    @Query('expiresIn') expiresIn: number,
    @CurrentUser() user: JwtUser,
  ) {
    const url = await this.storageService.getPresignedUrl(
      id,
      user.id,
      expiresIn || 3600,
    );
    return { url, expiresIn: expiresIn || 3600 };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFileDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.storageService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.storageService.delete(id, user.id);
    return { message: 'File deleted successfully' };
  }
}
