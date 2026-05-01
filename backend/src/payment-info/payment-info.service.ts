import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentInfoDto } from './dto/create-payment-info.dto';
import { UpdatePaymentInfoDto } from './dto/update-payment-info.dto';
import { PaymentInfo } from './entities/payment-info.entity';

@Injectable()
export class PaymentInfoService {
  constructor(
    @InjectRepository(PaymentInfo)
    private readonly paymentInfoRepository: Repository<PaymentInfo>,
  ) {}

  async create(
    createPaymentInfoDto: CreatePaymentInfoDto,
  ): Promise<PaymentInfo> {
    const paymentInfo = this.paymentInfoRepository.create(createPaymentInfoDto);
    return this.paymentInfoRepository.save(paymentInfo);
  }

  async findAll(): Promise<PaymentInfo[]> {
    return this.paymentInfoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentInfo> {
    const paymentInfo = await this.paymentInfoRepository.findOne({
      where: { id },
    });

    if (!paymentInfo) {
      throw new NotFoundException('Payment info not found');
    }

    return paymentInfo;
  }

  async update(
    id: string,
    updatePaymentInfoDto: UpdatePaymentInfoDto,
  ): Promise<PaymentInfo> {
    const paymentInfo = await this.findOne(id);
    Object.assign(paymentInfo, updatePaymentInfoDto);
    return this.paymentInfoRepository.save(paymentInfo);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const paymentInfo = await this.findOne(id);
    await this.paymentInfoRepository.remove(paymentInfo);
    return { success: true };
  }
}
