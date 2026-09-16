import type { IUserProfile } from '../../interfacesAndTypes';

export const mockUser: IUserProfile = {
  _id: 'user-001',
  firstName: 'Alice',
  lastName: 'Dev',
  email: 'alice@example.com',
  age: 28,
  gender: 'female',
  bio: 'Passionate frontend developer',
  about: 'Loves React and testing',
  profilePic: undefined,
};

export const mockUser2: IUserProfile = {
  _id: 'user-002',
  firstName: 'Bob',
  lastName: 'Coder',
  email: 'bob@example.com',
  age: 32,
  gender: 'male',
  bio: 'Full-stack engineer',
  about: 'Node.js enthusiast',
  profilePic: undefined,
};

export const mockFeedResponse = {
  message: 'Feed loaded',
  data: {
    count: 2,
    records: [mockUser, mockUser2],
  },
};

export const mockEmptyFeedResponse = {
  message: 'Feed loaded',
  data: {
    count: 0,
    records: [],
  },
};

export const mockConnectionsResponse = {
  message: 'Connections loaded',
  data: {
    count: 1,
    records: [mockUser2],
  },
};

export const mockLoginResponse = {
  message: 'Login successful',
  data: mockUser,
};

export const mockSignupResponse = {
  message: 'Signup successful',
};

export const mockProfileUpdateResponse = {
  message: 'Profile updated successfully.',
  data: { ...mockUser, firstName: 'AliceUpdated' },
};

export const mockLogoutResponse = {
  message: 'Logout successful',
};
