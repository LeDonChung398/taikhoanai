import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserTransactionDto } from './dto/create-user-transaction.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import {
  UserTransaction,
  UserTransactionType,
} from './entities/user-transaction.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(UserTransaction)
    private readonly userTransactionsRepository: Repository<UserTransaction>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }, { username: createUserDto.username }],
    });

    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const roleName = createUserDto.role ?? UserRole.BUYER;
    const role = await this.rolesRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new NotFoundException(`Role not found: ${roleName}`);
    }

    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      balance: createUserDto.balance ?? 0,
      password: await bcrypt.hash(createUserDto.password, 10),
      role,
      roleId: role.id,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingByUsername = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingByUsername && existingByUsername.id !== id) {
        throw new ConflictException('Username already exists');
      }
      user.username = updateUserDto.username;
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingByEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      const role = await this.rolesRepository.findOne({
        where: { name: updateUserDto.role },
      });
      if (!role) {
        throw new NotFoundException(`Role not found: ${updateUserDto.role}`);
      }
      user.role = role;
      user.roleId = role.id;
    }

    if (updateUserDto.balance !== undefined) {
      user.balance = updateUserDto.balance;
    }

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);
  }

  async createTransaction(
    userId: string,
    createUserTransactionDto: CreateUserTransactionDto,
  ): Promise<UserTransaction> {
    const user = await this.findById(userId);
    const normalizedReason = createUserTransactionDto.reason.trim();

    if (!normalizedReason) {
      throw new BadRequestException('Transaction reason is required');
    }

    if (
      createUserTransactionDto.type === UserTransactionType.DEBIT &&
      user.balance < createUserTransactionDto.amount
    ) {
      throw new BadRequestException('Insufficient balance for debit transaction');
    }

    if (createUserTransactionDto.type === UserTransactionType.CREDIT) {
      user.balance += createUserTransactionDto.amount;
    } else {
      user.balance -= createUserTransactionDto.amount;
    }

    await this.usersRepository.save(user);

    const transaction = this.userTransactionsRepository.create({
      userId,
      type: createUserTransactionDto.type,
      amount: createUserTransactionDto.amount,
      reason: normalizedReason,
    });

    return this.userTransactionsRepository.save(transaction);
  }

  async findTransactionsByUserId(userId: string): Promise<UserTransaction[]> {
    await this.findById(userId);

    return this.userTransactionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
