export interface CreateUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUser {
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt: Date;
}
