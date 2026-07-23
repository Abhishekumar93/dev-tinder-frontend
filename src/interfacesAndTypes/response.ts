import type { SWRConfiguration } from 'swr';

interface IMessageInResponse {
  message: string;
}
export interface IApiResponse<T> extends IMessageInResponse {
  data?: T;
}

export interface IApiListResponse<T> extends IMessageInResponse {
  data?: {
    count: number;
    records: T;
  };
}

export type MutationResponse<T> = IApiResponse<T> | IApiListResponse<T>;

export interface ApiMutation<T> {
  url: string;
  body?: T;
  method: 'DELETE' | 'PATCH' | 'POST' | 'PUT';
  displaySuccessToast: boolean;
  successToastMessage?: string;
  displayErrorToast: boolean;
  errorToastMessage?: string;
}

export type QueryKey = string | [string, Record<string, unknown>];

export interface ApiQuery extends SWRConfiguration {
  url: QueryKey;
  displaySuccessToast: boolean;
  successToastMessage?: string;
  displayErrorToast: boolean;
  errorToastMessage?: string;
}

export type HandleSuccessToast = {
  displaySuccessToast: boolean;
  successToastMessage?: string;
  responseMessage?: string;
};

export type HandleErrorToast = {
  error: unknown;
  displayErrorToast: boolean;
  errorToastMessage?: string;
};
