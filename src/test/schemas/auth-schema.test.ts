import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  signupSchema,
} from '../../SchemaValidation';

// ---------------------------------------------------------------------------
// Login schema
// ---------------------------------------------------------------------------

describe('loginSchema', () => {
  it('accepts a valid password login', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'password',
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid OTP login', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'otp',
      email: 'user@example.com',
      otp: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'password',
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages).toContain('Email must be a valid email address');
  });

  it('rejects missing password in password login', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'password',
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages).toContain('Password is required');
  });

  it('rejects missing OTP in OTP login', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'otp',
      email: 'user@example.com',
      otp: '',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages).toContain('OTP is required');
  });

  it('rejects missing email in any login method', () => {
    const result = loginSchema.safeParse({
      loginMethod: 'password',
      email: '',
      password: 'secret',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages).toContain('Email is required');
  });
});

// ---------------------------------------------------------------------------
// Signup schema
// ---------------------------------------------------------------------------

describe('signupSchema', () => {
  const validSignup = {
    firstName: 'Alice',
    lastName: 'Dev',
    email: 'alice@example.com',
    password: 'Secret@123',
    confirmPassword: 'Secret@123',
    age: 25,
    gender: 'female',
    bio: 'Hello there',
    about: '',
  };

  it('accepts a fully valid signup', () => {
    const result = signupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it('rejects mismatched password confirmation', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: 'DifferentPass@1',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages).toContain('Passwords do not match');
  });

  it('rejects a weak password missing uppercase, number, and symbol', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: 'weakpassword',
      confirmPassword: 'weakpassword',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages.some((m) => m.toLowerCase().includes('uppercase'))).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: 'Ab@1',
      confirmPassword: 'Ab@1',
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('8 characters'))).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      firstName: '',
      gender: '',
      bio: '',
    });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toContain('firstName');
    expect(paths).toContain('gender');
    expect(paths).toContain('bio');
  });

  it('rejects negative age', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      age: -5,
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('greater than 0'))).toBe(true);
  });
});
