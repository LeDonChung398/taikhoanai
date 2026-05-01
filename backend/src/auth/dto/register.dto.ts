import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
