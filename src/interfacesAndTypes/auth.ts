import { z } from 'zod';
import type { loginSchema, signupSchema } from '../SchemaValidation';

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
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
  bio: string;
  about?: string;
}

export type PasswordFieldType = 'password' | 'confirmPassword';
export type DisplaySignupPasswordInput = {
  fieldType: PasswordFieldType;
  label: string;
  placeholder: string;
};
export type SignupPayload = Omit<SignupForm, 'confirmPassword'>;
export type IUserProfile = IUser & { _id: string };
