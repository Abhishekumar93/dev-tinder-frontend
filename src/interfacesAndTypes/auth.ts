import { z } from 'zod';
import type { loginSchema } from '../SchemaValidation';

export type LoginForm = z.infer<typeof loginSchema>;
type LoginWithPwd = { email: string; password: string };
type LoginWithOtp = { email: string; otp: string };
export type LoginPayload = LoginWithOtp | LoginWithPwd;

export interface IUser {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  profilePic?: string;
  gender: string;
  about?: string;
}
