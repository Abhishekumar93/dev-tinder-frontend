import type { IUserProfile } from '../../interfacesAndTypes';

export interface AuthSlice {
  user: IUserProfile | null;
  setUser: (user: IUserProfile) => void;
  logoutUser: () => void;
}
