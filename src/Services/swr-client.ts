import type { AxiosResponse } from 'axios';
import type { MutationResponse } from '../interfacesAndTypes';
import { apiClient } from './interceptor';

// Define a type for complex mutation keys
export type MutationKey = [
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  data?: unknown,
];

export type SwrClientResponse<T extends MutationResponse<any>> = T & {
  status: number;
};

export const swrClient = async <T extends MutationResponse<any>>(
  key: string | MutationKey
): Promise<SwrClientResponse<T>> => {
  // 1. If it's a simple string, default to a standard GET request
  if (typeof key === 'string') {
    const response = await apiClient.get<T>(key);
    return {
      ...(response.data as T),
      status: response.status,
    } as SwrClientResponse<T>;
  }

  // 2. Destructure the method array configuration
  const [url, method, body] = key;

  // 3. Dynamic execution engine routing based on your method parameter
  const response: AxiosResponse<T> = await apiClient({
    url,
    method,
    data: body, // Attached data object payload automatically for POST/PUT
  });

  return {
    ...(response.data as T),
    status: response.status,
  } as SwrClientResponse<T>;
};
