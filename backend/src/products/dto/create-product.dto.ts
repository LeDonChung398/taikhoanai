import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(150)
  slug: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  countryId: string;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  soldQuantity?: number;

  @IsInt()
  @Min(1)
  minPurchaseQuantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  highlight?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imageUrl?: string;
}
