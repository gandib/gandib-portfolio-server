import { Model } from 'mongoose';

export type TUserRole = 'ADMIN';

export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
