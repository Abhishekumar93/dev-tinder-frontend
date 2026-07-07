export interface ApiMutation<T> {
  url: string;
  body?: T;
  method: 'DELETE' | 'PATCH' | 'POST' | 'PUT';
  displaySuccessToast: boolean;
  successToastMessage?: string;
  displayErrorToast: boolean;
  errorToastMessage?: string;
}
