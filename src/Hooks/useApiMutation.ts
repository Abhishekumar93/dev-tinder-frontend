import { useId } from 'react';
import useSWRMutation from 'swr/mutation';
import type { ApiMutation, MutationResponse } from '../interfacesAndTypes';
import { swrClient } from '../Services/swr-client';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { COMMON_CONSTANTS } from '../constants';

const { SOMETHING_WENT_WRONG } = COMMON_CONSTANTS;

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
    try {
      const response = await trigger(options);

      if (options.displaySuccessToast)
        toast.success(response?.message || options.successToastMessage);

      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage && options.errorToastMessage)
          errorMessage = options.errorToastMessage;
        toast.error(errorMessage || SOMETHING_WENT_WRONG);
      } else {
        toast.error(SOMETHING_WENT_WRONG);
      }
    }

    return undefined;
  };

  return { executeMutation, isMutating };
};
