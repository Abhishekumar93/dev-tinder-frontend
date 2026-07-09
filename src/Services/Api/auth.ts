import type {
  ApiMutation,
  LoginForm,
  LoginPayload,
} from '../../interfacesAndTypes';
import { AUTH_CONSTANTS, HTTP_METHOD } from '../../constants';

const { LOGIN_FAILED } = AUTH_CONSTANTS;
const { POST } = HTTP_METHOD;

export const loginUser = (
  loginDetail: LoginForm
): ApiMutation<LoginPayload> => {
  const { email, loginMethod, otp, password } = loginDetail;
  const payload: LoginPayload = {
    email,
    ...(loginMethod === 'password' ? { password } : { otp }),
  };

  return {
    url: '/auth/login',
    method: POST,
    body: payload,
    displaySuccessToast: true,
    displayErrorToast: true,
    errorToastMessage: LOGIN_FAILED,
  };
};
