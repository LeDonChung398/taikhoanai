import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const payload: CreateUserDto = {
      ...registerDto,
      role: UserRole.BUYER,
    };

    const user = await this.usersService.create(payload);
    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsernameWithPassword(
      loginDto.username,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.buildAuthResponse(user);
  }

  async me(userId: string) {
    return this.usersService.findById(userId);
  }

  async myTransactions(userId: string) {
    return this.usersService.findTransactionsByUserId(userId);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.usersService.changePassword(userId, currentPassword, newPassword);
  }

  private buildAuthResponse(user: User) {
    const roleName = user.role?.name ?? UserRole.BUYER;

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: roleName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        role: roleName,
      },
    };
  }
}
