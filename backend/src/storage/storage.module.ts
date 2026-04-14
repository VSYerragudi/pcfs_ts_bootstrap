import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  FileMetadata,
  FileMetadataSchema,
} from './schemas/file-metadata.schema';
import { createS3Client, S3_CLIENT } from './config/s3.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileMetadata.name, schema: FileMetadataSchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ConfigModule,
  ],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: S3_CLIENT,
      useFactory: (configService: ConfigService) =>
        createS3Client(configService),
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
