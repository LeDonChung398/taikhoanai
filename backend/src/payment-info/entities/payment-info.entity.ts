import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_info')
export class PaymentInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 40 })
  accountNumber: string;

  @Column({ length: 200 })
  transferContent: string;

  @Column({ length: 120 })
  accountHolder: string;

  @Column({ length: 120 })
  bankName: string;

  @Column({ nullable: true })
  qrImageUrl?: string;

  @Column({
    type: 'text',
    default:
      'Enter the exact transfer content so the system can auto credit your balance',
  })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
