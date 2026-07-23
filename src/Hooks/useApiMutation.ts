import { useId } from 'react';
import useSWRMutation from 'swr/mutation';
import type { ApiMutation, MutationResponse } from '../interfacesAndTypes';
import { swrClient } from '../Services/swr-client';
import { handleErrorToast, handleSuccessToast } from '../utils.ts/api-response';

export const useApiMutation = <
  TResponse extends MutationResponse<unknown> = MutationResponse<unknown>,
  TPayload = unknown,
>() => {
  const instanceId = useId();
  const cacheKey = `__dynamic_mutation_${instanceId}`;

  const { trigger, isMutating } = useSWRMutation<
    TResponse & { status: number },
    unknown,
    string,
    ApiMutation<TPayload>
  >(cacheKey, (_, { arg }) =>
    swrClient<TResponse>([arg.url, arg.method, arg.body])
  );

  const executeMutation = async (options: ApiMutation<TPayload>) => {
    const {
      displayErrorToast,
      displaySuccessToast,
      errorToastMessage,
      successToastMessage,
    } = options;
    try {
      const response = await trigger(options);

      handleSuccessToast({
        displaySuccessToast,
        responseMessage: response.message,
        successToastMessage,
      });

      return response;
    } catch (error) {
      handleErrorToast({ displayErrorToast, error, errorToastMessage });
    }

    return undefined;
  };

  return { executeMutation, isMutating };
};
