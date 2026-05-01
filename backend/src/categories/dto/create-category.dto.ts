import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(120)
  slug: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imageUrl?: string;
}
