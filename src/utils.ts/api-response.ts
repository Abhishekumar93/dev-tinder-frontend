import { isAxiosError } from 'axios';
import { COMMON_CONSTANTS } from '../constants';
import { toast } from 'sonner';
import type {
  HandleErrorToast,
  HandleSuccessToast,
} from '../interfacesAndTypes/response';

const { SOMETHING_WENT_WRONG } = COMMON_CONSTANTS;

export const handleErrorToast = ({
  displayErrorToast,
  error,
  errorToastMessage,
}: HandleErrorToast) => {
  if (!displayErrorToast) return;
  let errorMessage = SOMETHING_WENT_WRONG;
  if (isAxiosError(error)) {
    errorMessage = error.response?.data?.message;
    if (!errorMessage && errorToastMessage) errorMessage = errorToastMessage;
  }
  toast.error(errorMessage);
};

export const handleSuccessToast = ({
  displaySuccessToast,
  responseMessage,
  successToastMessage,
}: HandleSuccessToast) => {
  const successMessage = responseMessage || successToastMessage;
  if (displaySuccessToast && successMessage) toast.success(successMessage);
};
