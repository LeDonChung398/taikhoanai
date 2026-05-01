import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CreatePaymentInfoDto } from './dto/create-payment-info.dto';
import { UpdatePaymentInfoDto } from './dto/update-payment-info.dto';
import { PaymentInfoService } from './payment-info.service';

@Controller('payment-info')
export class PaymentInfoController {
  constructor(private readonly paymentInfoService: PaymentInfoService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createPaymentInfoDto: CreatePaymentInfoDto) {
    return this.paymentInfoService.create(createPaymentInfoDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.paymentInfoService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentInfoService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentInfoDto: UpdatePaymentInfoDto,
  ) {
    return this.paymentInfoService.update(id, updatePaymentInfoDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentInfoService.remove(id);
  }
}
