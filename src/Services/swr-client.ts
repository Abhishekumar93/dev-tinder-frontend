import { apiClient } from './interceptor';

// Define a type for complex mutation keys
export type MutationKey = [
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  data?: unknown,
];

export const swrClient = async <T>(key: string | MutationKey): Promise<T> => {
  // 1. If it's a simple string, default to a standard GET request
  if (typeof key === 'string') {
    const response = await apiClient.get<T>(key);
    return response.data;
  }

  // 2. Destructure the method array configuration
  const [url, method, body] = key;

  // 3. Dynamic execution engine routing based on your method parameter
  const response = await apiClient({
    url,
    method,
    data: body, // Attached data object payload automatically for POST/PUT
  });

  return response.data;
};
