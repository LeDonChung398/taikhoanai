import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserTransactionType } from '../users/entities/user-transaction.entity';
import { CreateDepositRequestDto } from './dto/create-deposit-request.dto';
import { DepositRequest, DepositStatus } from './entities/deposit-request.entity';

@Injectable()
export class DepositRequestsService {
  constructor(
    @InjectRepository(DepositRequest)
    private readonly repo: Repository<DepositRequest>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateDepositRequestDto): Promise<DepositRequest> {
    const request = this.repo.create({
      userId,
      amount: dto.amount,
      note: dto.note,
      status: DepositStatus.PENDING,
    });
    return this.repo.save(request);
  }

  async findMine(userId: string): Promise<DepositRequest[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<DepositRequest[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async approve(id: string): Promise<DepositRequest> {
    const request = await this.repo.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Deposit request not found');
    if (request.status !== DepositStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    request.status = DepositStatus.APPROVED;
    await this.repo.save(request);

    await this.usersService.createTransaction(request.userId, {
      type: UserTransactionType.CREDIT,
      amount: request.amount,
      reason: `Duyệt nạp tiền #${request.id.slice(0, 8).toUpperCase()}`,
    });

    return request;
  }

  async reject(id: string): Promise<DepositRequest> {
    const request = await this.repo.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Deposit request not found');
    if (request.status !== DepositStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    request.status = DepositStatus.REJECTED;
    return this.repo.save(request);
  }
}
