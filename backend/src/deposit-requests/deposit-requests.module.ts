import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DepositRequestsController } from './deposit-requests.controller';
import { DepositRequestsService } from './deposit-requests.service';
import { DepositRequest } from './entities/deposit-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositRequest]), UsersModule],
  controllers: [DepositRequestsController],
  providers: [DepositRequestsService],
})
export class DepositRequestsModule {}
