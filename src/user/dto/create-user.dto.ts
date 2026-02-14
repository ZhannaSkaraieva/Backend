import type { CreateUser } from '../intertypes/user.intertype';
export class CreateUserDto implements CreateUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
