import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.BUYER, UserRole.ADMIN)
  @Post()
  create(@Req() req: { user: RequestUser }, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, createOrderDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles(UserRole.BUYER, UserRole.ADMIN)
  @Get('my')
  findMine(@Req() req: { user: RequestUser }) {
    return this.ordersService.findMine(req.user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderDto);
  }
}
