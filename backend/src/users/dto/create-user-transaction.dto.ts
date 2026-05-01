import {
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserTransactionType } from '../entities/user-transaction.entity';

export class CreateUserTransactionDto {
  @IsEnum(UserTransactionType)
  type: UserTransactionType;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  reason: string;
}
