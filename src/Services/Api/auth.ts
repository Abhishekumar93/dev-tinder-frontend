import { toast } from 'sonner';
import type { LoginForm } from '../../interfacesAndTypes';
import { apiClient } from '../interceptor';
import { isAxiosError } from 'axios';
import { AUTH_CONSTANTS, COMMON_CONSTANTS } from '../../constants';

const { LOGIN_FAILED } = AUTH_CONSTANTS;
const { SOMETHING_WENT_WRONG } = COMMON_CONSTANTS;

export const loginUser = async (loginDetail: LoginForm) => {
  try {
    const { email, loginMethod, otp, password } = loginDetail;
    const payload = {
      email,
      ...(loginMethod === 'password' ? { password } : { otp }),
    };
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.message || LOGIN_FAILED);
    } else {
      toast.error(SOMETHING_WENT_WRONG);
    }
  }
};
