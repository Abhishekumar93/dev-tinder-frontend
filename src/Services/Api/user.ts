import { API_BASE_URL, AUTH_CONSTANTS, HTTP_METHOD } from '../../constants';
import type { ApiMutation, IUser } from '../../interfacesAndTypes';

const { PROFILE_UPDATE_FAILED } = AUTH_CONSTANTS;
const { PATCH } = HTTP_METHOD;
const { user } = API_BASE_URL;

export const getUserFeed = () => {
  return {
    url: `${user}/feed`,
    displayErrorToast: true,
    displaySuccessToast: true,
  };
};

export const updateUserProfile = (userProfile: IUser): ApiMutation<IUser> => {
  const profilePayload = { ...userProfile };
  profilePayload.age = Number(profilePayload.age);

  return {
    url: user,
    method: PATCH,
    body: profilePayload,
    displaySuccessToast: true,
    displayErrorToast: true,
    errorToastMessage: PROFILE_UPDATE_FAILED,
  };
};
