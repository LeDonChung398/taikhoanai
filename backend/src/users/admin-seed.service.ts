import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const username = this.configService.get<string>('ADMIN_USERNAME', 'admin');

    if (!email || !password) {
      return;
    }

    const existing = await this.usersRepository.findOne({ where: { email } });

    if (existing) {
      return;
    }

    const adminRole = await this.rolesRepository.findOne({
      where: { name: UserRole.ADMIN },
    });

    if (!adminRole) {
      this.logger.warn('Admin role not found. Skip default admin seeding.');
      return;
    }

    const admin = this.usersRepository.create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
      role: adminRole,
      roleId: adminRole.id,
    });

    await this.usersRepository.save(admin);
    this.logger.log(`Created default admin account: ${email}`);
  }
}
