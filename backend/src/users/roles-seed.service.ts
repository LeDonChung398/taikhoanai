import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const requiredRoles: Array<{ name: UserRole; description: string }> = [
      { name: UserRole.ADMIN, description: 'System administrator' },
      { name: UserRole.BUYER, description: 'Default buyer account' },
    ];

    for (const roleData of requiredRoles) {
      const existing = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existing) {
        await this.rolesRepository.save(this.rolesRepository.create(roleData));
      }
    }
  }
}
