import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { UserTransaction } from './user-transaction.entity';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 120 })
  email: string;

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column('uuid')
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => UserTransaction, (transaction) => transaction.user)
  transactions: UserTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
