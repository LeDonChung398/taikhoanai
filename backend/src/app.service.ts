import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      service: 'taikhoanai-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
