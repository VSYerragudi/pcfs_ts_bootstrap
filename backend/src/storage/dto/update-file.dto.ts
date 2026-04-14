import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { FileVisibility } from '../schemas/file-metadata.schema';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  folder?: string;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}
