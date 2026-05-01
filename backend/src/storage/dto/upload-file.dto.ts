import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-zA-Z0-9/_-]+$/)
  folder?: string;
}
