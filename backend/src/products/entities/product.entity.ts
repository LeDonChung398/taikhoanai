import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Country } from '../../countries/entities/country.entity';

const priceTransformer = {
  to: (value: number): string => value.toString(),
  from: (value: string): number => Number(value),
};

@Entity('products')
@Unique(['slug'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  slug: string;

  @Column('int', { default: 0 })
  stockQuantity: number;

  @Column('int', { default: 0 })
  soldQuantity: number;

  @Column('int', { default: 1 })
  minPurchaseQuantity: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: priceTransformer,
  })
  price: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'text', nullable: true })
  highlight?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('uuid')
  countryId: string;

  @ManyToOne(() => Country, (country) => country.products, {
    nullable: false,
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
