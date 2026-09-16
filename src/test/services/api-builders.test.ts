import { describe, it, expect } from 'vitest';
import { signupUser, loginUser, logoutUser } from '../../Services/Api/auth';
import { getUserFeed, getAllConnections, updateUserProfile } from '../../Services/Api/user';
import type { SignupForm, LoginForm, IUser } from '../../interfacesAndTypes';

// ---------------------------------------------------------------------------
// Auth API builders
// ---------------------------------------------------------------------------

describe('signupUser', () => {
  it('constructs correct signup mutation config without confirmPassword', () => {
    const form: SignupForm = {
      firstName: 'Alice',
      lastName: 'Dev',
      email: 'alice@example.com',
      password: 'Secret@123',
      confirmPassword: 'Secret@123',
      age: 25,
      gender: 'female',
      bio: 'Hello',
      about: 'More info',
    };
    const result = signupUser(form);
    expect(result.url).toBe('/auth/signup');
    expect(result.method).toBe('POST');
    expect(result.body).not.toHaveProperty('confirmPassword');
    expect(result.body).toMatchObject({
      firstName: 'Alice',
      email: 'alice@example.com',
    });
    expect(result.displaySuccessToast).toBe(true);
    expect(result.displayErrorToast).toBe(true);
  });
});

describe('loginUser', () => {
  it('constructs password login payload with email and password only', () => {
    const form: LoginForm = {
      loginMethod: 'password',
      email: 'user@example.com',
      password: 'secret',
      otp: undefined,
    };
    const result = loginUser(form);
    expect(result.url).toBe('/auth/login');
    expect(result.method).toBe('POST');
    expect(result.body).toEqual({ email: 'user@example.com', password: 'secret' });
    expect(result.body).not.toHaveProperty('otp');
  });

  it('constructs OTP login payload with email and otp only', () => {
    const form: LoginForm = {
      loginMethod: 'otp',
      email: 'user@example.com',
      otp: '123456',
      password: undefined,
    };
    const result = loginUser(form);
    expect(result.body).toEqual({ email: 'user@example.com', otp: '123456' });
    expect(result.body).not.toHaveProperty('password');
  });
});

describe('logoutUser', () => {
  it('constructs correct logout mutation config', () => {
    const result = logoutUser();
    expect(result.url).toBe('/auth/logout');
    expect(result.method).toBe('POST');
    expect(result.displaySuccessToast).toBe(true);
    expect(result.displayErrorToast).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// User API builders
// ---------------------------------------------------------------------------

describe('getUserFeed', () => {
  it('returns correct feed query config', () => {
    const result = getUserFeed();
    expect(result.url).toBe('/user/feed');
    expect(result.displayErrorToast).toBe(true);
  });
});

describe('getAllConnections', () => {
  it('returns correct connections query config', () => {
    const result = getAllConnections();
    expect(result.url).toBe('/user/connections');
    expect(result.displayErrorToast).toBe(true);
  });
});

describe('updateUserProfile', () => {
  it('constructs correct profile update mutation and coerces age to number', () => {
    const user: IUser = {
      firstName: 'Alice',
      lastName: 'Dev',
      email: 'alice@example.com',
      // Simulate age coming in as a string-number (from form)
      age: '28' as unknown as number,
      gender: 'female',
      bio: 'Hello',
    };
    const result = updateUserProfile(user);
    expect(result.url).toBe('/user');
    expect(result.method).toBe('PATCH');
    expect(result.body?.age).toBe(28);
    expect(typeof result.body?.age).toBe('number');
    expect(result.displaySuccessToast).toBe(true);
  });
});
