import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreatePaymentInfoDto {
  @IsString()
  @MaxLength(40)
  accountNumber: string;

  @IsString()
  @MaxLength(200)
  transferContent: string;

  @IsString()
  @MaxLength(120)
  accountHolder: string;

  @IsString()
  @MaxLength(120)
  bankName: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  qrImageUrl?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
