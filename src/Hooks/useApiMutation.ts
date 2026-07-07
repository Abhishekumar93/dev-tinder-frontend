import { useId } from 'react';
import useSWRMutation from 'swr/mutation';
import type { ApiMutation, MutationResponse } from '../interfacesAndTypes';
import { swrClient } from '../Services/swr-client';
import { toast } from 'sonner';

const useApiMutation = <
  TResponse = MutationResponse<unknown>,
  TPayload = unknown,
>() => {
  const instanceId = useId();
  const cacheKey = `__dynamic_mutation_${instanceId}`;

  const { trigger, isMutating } = useSWRMutation<
    TResponse,
    unknown,
    string,
    ApiMutation<TPayload>
  >(cacheKey, (_, { arg }) => swrClient([arg.url, arg.method, arg.body]));

  const executeMutation = async (options: ApiMutation<TPayload>) => {
    try {
      const response = await trigger(options);
      console.log(response);

      if (options.displaySuccessToast)
        toast.success(options.successToastMessage);
      // toast.success(response?.message || options.successToastMessage);
    } catch (error) {
      if (options.displayErrorToast) toast.error(options.errorToastMessage);
      throw error;
    }
  };
  return { executeMutation, isMutating };
};

export default useApiMutation;
