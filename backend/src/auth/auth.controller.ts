import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  me(@Req() req: { user: RequestUser }) {
    return this.authService.me(req.user.sub);
  }

  @Get('my-transactions')
  myTransactions(@Req() req: { user: RequestUser }) {
    return this.authService.myTransactions(req.user.sub);
  }

  @Patch('change-password')
  @HttpCode(200)
  changePassword(
    @Req() req: { user: RequestUser },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
  }
}
