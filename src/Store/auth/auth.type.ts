import type { IUser } from '../../interfacesAndTypes';

export interface AuthSlice {
  user: IUser | null;
  setUser: (user: IUser) => void;
  setLogout: () => void;
}
