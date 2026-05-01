import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentInfoDto } from './create-payment-info.dto';

export class UpdatePaymentInfoDto extends PartialType(CreatePaymentInfoDto) {}
