import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imgUrl?: string;
}
