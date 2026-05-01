import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  telegram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
