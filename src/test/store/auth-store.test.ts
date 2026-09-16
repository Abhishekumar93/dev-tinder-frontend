import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../Store';
import type { IUserProfile } from '../../interfacesAndTypes';

const mockUser: IUserProfile = {
  _id: 'store-user-001',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  age: 25,
  gender: 'male',
  bio: 'Just testing',
};

describe('useAppStore – auth slice', () => {
  // Reset store to clean state before each test
  beforeEach(() => {
    useAppStore.setState({ user: null });
  });

  it('starts with user as null', () => {
    expect(useAppStore.getState().user).toBeNull();
  });

  it('setUser stores the user in state', () => {
    useAppStore.getState().setUser(mockUser);
    expect(useAppStore.getState().user).toEqual(mockUser);
  });

  it('logoutUser clears the user from state', () => {
    useAppStore.getState().setUser(mockUser);
    useAppStore.getState().logoutUser();
    expect(useAppStore.getState().user).toBeNull();
  });

  it('does not leak state between tests (user is null from beforeEach reset)', () => {
    // This test relies on beforeEach resetting the store
    expect(useAppStore.getState().user).toBeNull();
    useAppStore.getState().setUser(mockUser);
    expect(useAppStore.getState().user?._id).toBe('store-user-001');
  });

  it('setUser replaces the previous user', () => {
    const anotherUser: IUserProfile = { ...mockUser, _id: 'store-user-002', firstName: 'Other' };
    useAppStore.getState().setUser(mockUser);
    useAppStore.getState().setUser(anotherUser);
    expect(useAppStore.getState().user?._id).toBe('store-user-002');
    expect(useAppStore.getState().user?.firstName).toBe('Other');
  });
});
