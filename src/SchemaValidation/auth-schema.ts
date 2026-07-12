import { z } from 'zod';
import { AUTH_CONSTANTS } from '../constants';

const { INVALID_EMAIL, REQUIRED_EMAIL, REQUIRED_PASSWORD, OTP_REQUIRED } =
  AUTH_CONSTANTS;

const emailSchema = z
  .object({
    email: z
      .string(REQUIRED_EMAIL)
      .min(1, REQUIRED_EMAIL)
      .pipe(z.email({ message: INVALID_EMAIL })),
  })
  .strict();
const passwordSchema = z
  .object({
    password: z.string().min(1, { message: REQUIRED_PASSWORD }),
  })
  .strict();
const otpSchema = z
  .object({
    otp: z.string().min(1, { message: OTP_REQUIRED }),
  })
  .strict();

export const passwordLoginSchema = z.object({
  loginMethod: z.literal('password'),
  ...emailSchema.shape,
  ...passwordSchema.shape,
  otp: z.string().optional(),
});
export const otpLoginSchema = z.object({
  loginMethod: z.literal('otp'),
  ...emailSchema.shape,
  ...otpSchema.shape,
  password: z.string().optional(),
});
export const loginSchema = z.discriminatedUnion('loginMethod', [
  passwordLoginSchema,
  otpLoginSchema,
]);

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    ...emailSchema.shape,
    ...passwordSchema.shape,
    age: z.coerce
      .number({ message: 'Age is required' })
      .positive('Age must be greater than 0'),
    gender: z.string().min(1, 'Gender is required'),
    bio: z.string().min(1, 'Bio is required'),
    about: z.string().optional(),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
