import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly publicUrlBase: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('R2_ENDPOINT', '');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID', '');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY', '');

    this.bucket = this.configService.get<string>('R2_BUCKET', '');
    this.endpoint = endpoint;
    this.publicUrlBase = this.configService.get<string>('R2_PUBLIC_URL_BASE', '');

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'uploads') {
    if (!this.endpoint || !this.bucket) {
      throw new InternalServerErrorException('R2 is not fully configured');
    }

    if (!file.buffer || file.size === 0) {
      throw new BadRequestException('Invalid file');
    }

    const safeFolder = folder.trim().replace(/[^a-zA-Z0-9/_-]/g, '') || 'uploads';
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${safeFolder}/${Date.now()}-${randomUUID()}-${sanitizedName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = this.publicUrlBase
      ? `${this.publicUrlBase.replace(/\/$/, '')}/${key}`
      : `${this.endpoint.replace(/\/$/, '')}/${this.bucket}/${key}`;

    return {
      key,
      url,
    };
  }
}
