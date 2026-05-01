import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserTransactionDto } from './dto/create-user-transaction.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id/transactions')
  findTransactions(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findTransactionsByUserId(id);
  }

  @Roles(UserRole.ADMIN)
  @Post(':id/transactions')
  createTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createUserTransactionDto: CreateUserTransactionDto,
  ) {
    return this.usersService.createTransaction(id, createUserTransactionDto);
  }
}
