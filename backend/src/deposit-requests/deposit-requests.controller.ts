import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateDepositRequestDto } from './dto/create-deposit-request.dto';
import { DepositRequestsService } from './deposit-requests.service';

@Controller('deposit-requests')
export class DepositRequestsController {
  constructor(private readonly service: DepositRequestsService) {}

  @Roles(UserRole.BUYER, UserRole.ADMIN)
  @Post()
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateDepositRequestDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Roles(UserRole.BUYER, UserRole.ADMIN)
  @Get('my')
  findMine(@Req() req: { user: RequestUser }) {
    return this.service.findMine(req.user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.approve(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/reject')
  reject(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.reject(id);
  }
}
