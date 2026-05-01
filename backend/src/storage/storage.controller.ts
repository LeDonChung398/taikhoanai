import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UploadFileDto } from './dto/upload-file.dto';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Roles(UserRole.ADMIN)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('Missing upload file');
    }

    return this.storageService.uploadImage(file, body.folder ?? 'uploads');
  }
}
