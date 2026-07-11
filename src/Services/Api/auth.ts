import type {
  ApiMutation,
  LoginForm,
  LoginPayload,
} from '../../interfacesAndTypes';
import { API_BASE_URL, AUTH_CONSTANTS, HTTP_METHOD } from '../../constants';

const { LOGIN_FAILED, LOGOUT_FAILED } = AUTH_CONSTANTS;
const { POST } = HTTP_METHOD;
const { auth } = API_BASE_URL;

export const loginUser = (
  loginDetail: LoginForm
): ApiMutation<LoginPayload> => {
  const { email, loginMethod, otp, password } = loginDetail;
  const payload: LoginPayload = {
    email,
    ...(loginMethod === 'password' ? { password } : { otp }),
  };

  return {
    url: `${auth}/login`,
    method: POST,
    body: payload,
    displaySuccessToast: true,
    displayErrorToast: true,
    errorToastMessage: LOGIN_FAILED,
  };
};

export const logoutUser = () => ({
  url: `${auth}/logout`,
  method: POST,
  displaySuccessToast: true,
  displayErrorToast: true,
  errorToastMessage: LOGOUT_FAILED,
});
