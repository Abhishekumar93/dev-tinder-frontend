import useSWR from 'swr';
import type {
  ApiQuery,
  MutationResponse,
  QueryKey,
} from '../interfacesAndTypes';
import { swrClient } from '../Services/swr-client';
import { handleErrorToast, handleSuccessToast } from '../utils.ts/api-response';

export const useApiQuery = <
  TData = unknown,
  TResponse extends MutationResponse<TData> = MutationResponse<TData>,
>(
  options: ApiQuery
) => {
  const {
    displayErrorToast,
    displaySuccessToast,
    url,
    errorToastMessage,
    successToastMessage,
    ...swrConfig
  } = options;
  const queryFetcher = async (queryKey: QueryKey): Promise<TResponse> => {
    if (typeof queryKey === 'string') {
      return swrClient<TResponse>(queryKey);
    }

    const [apiUrl, params] = queryKey;
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const apiEndpoint = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    return swrClient<TResponse>(apiEndpoint);
  };

  const swrResponse = useSWR<TResponse, unknown>(url, queryFetcher, {
    onSuccess(data) {
      handleSuccessToast({
        displaySuccessToast,
        responseMessage: data.message,
        successToastMessage,
      });
    },
    onError(error) {
      handleErrorToast({ displayErrorToast, error, errorToastMessage });
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    ...swrConfig,
  });

  return swrResponse;
};
