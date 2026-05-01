import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentInfoController } from './payment-info.controller';
import { PaymentInfoService } from './payment-info.service';
import { PaymentInfo } from './entities/payment-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInfo])],
  controllers: [PaymentInfoController],
  providers: [PaymentInfoService],
})
export class PaymentInfoModule {}
