import { UserRole } from '../enums/user-role.enum';

export interface RequestUser {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
}
