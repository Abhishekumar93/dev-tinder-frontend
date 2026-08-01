import type { IUserProfile } from './auth';
import type { MutationResponse } from './response';

export type IUserDetails = {
  data: MutationResponse<IUserProfile> | undefined;
  isLoading: boolean;
  error: unknown;
  showCtas?: boolean;
};
