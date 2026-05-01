import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

const amountTransformer = {
  to: (value: number): string => value.toString(),
  from: (value: string): number => Number(value),
};

export enum DepositStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('deposit_requests')
export class DepositRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { nullable: false, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: amountTransformer,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: DepositStatus,
    default: DepositStatus.PENDING,
  })
  status: DepositStatus;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
