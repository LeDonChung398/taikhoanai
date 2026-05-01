import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum UserTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity('user_transactions')
export class UserTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: UserTransactionType,
  })
  type: UserTransactionType;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ length: 255 })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
