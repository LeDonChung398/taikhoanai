import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSeedService } from './admin-seed.service';
import { Role } from './entities/role.entity';
import { UserTransaction } from './entities/user-transaction.entity';
import { User } from './entities/user.entity';
import { RolesSeedService } from './roles-seed.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserTransaction])],
  providers: [UsersService, RolesSeedService, AdminSeedService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
