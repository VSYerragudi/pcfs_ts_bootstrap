import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileMetadataDocument = HydratedDocument<FileMetadata>;

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true, collection: 'file_metadata' })
export class FileMetadata {
  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true, unique: true })
  storageKey!: string; // S3 key (path in SeaweedFS)

  @Prop({ required: true })
  mimeType!: string;

  @Prop({ required: true })
  size!: number; // bytes

  @Prop({
    required: true,
    enum: FileVisibility,
    default: FileVisibility.PRIVATE,
  })
  visibility!: FileVisibility;

  @Prop({ required: true })
  uploadedBy!: string; // userId

  @Prop()
  uploadedByEmail!: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  folder?: string; // Virtual folder organization

  @Prop({ type: Object })
  customMetadata?: Record<string, unknown>;

  @Prop()
  contentHash?: string; // For deduplication/integrity

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);

// Indexes for efficient querying
FileMetadataSchema.index({ uploadedBy: 1, createdAt: -1 });
FileMetadataSchema.index({ visibility: 1 });
FileMetadataSchema.index({ folder: 1, createdAt: -1 });
FileMetadataSchema.index({ tags: 1 });
FileMetadataSchema.index({ storageKey: 1 }, { unique: true });
