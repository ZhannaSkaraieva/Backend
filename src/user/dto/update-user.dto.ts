import { UpdateUser } from '../intertypes/user.intertype';

export class UpdateUserDto implements UpdateUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
