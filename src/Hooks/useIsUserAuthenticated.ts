import { useAppStore } from '../Store';

export const useIsUserAuthenticated = () => {
  const loggedInUser = useAppStore((state) => state.user);
  return !!loggedInUser;
};
