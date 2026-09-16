import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { handleErrorToast, handleSuccessToast } from '../../utils.ts/api-response';

// Mock sonner toast so we don't need a real DOM
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { toast } from 'sonner';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleErrorToast', () => {
  it('shows the response message from an Axios error', () => {
    const axiosError = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      { data: { message: 'Invalid credentials' }, status: 401 } as never
    );

    handleErrorToast({ displayErrorToast: true, error: axiosError });
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('falls back to errorToastMessage when Axios response has no message', () => {
    const axiosError = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      { data: {}, status: 500 } as never
    );

    handleErrorToast({
      displayErrorToast: true,
      error: axiosError,
      errorToastMessage: 'Custom error',
    });
    expect(toast.error).toHaveBeenCalledWith('Custom error');
  });

  it('shows the generic message for non-Axios errors', () => {
    handleErrorToast({ displayErrorToast: true, error: new Error('network') });
    expect(toast.error).toHaveBeenCalledWith('Something went wrong. Please try again later.');
  });

  it('does nothing when displayErrorToast is false', () => {
    handleErrorToast({ displayErrorToast: false, error: new Error('x') });
    expect(toast.error).not.toHaveBeenCalled();
  });
});

describe('handleSuccessToast', () => {
  it('shows responseMessage when displaySuccessToast is true', () => {
    handleSuccessToast({ displaySuccessToast: true, responseMessage: 'Login successful' });
    expect(toast.success).toHaveBeenCalledWith('Login successful');
  });

  it('falls back to successToastMessage when responseMessage is absent', () => {
    handleSuccessToast({ displaySuccessToast: true, successToastMessage: 'Done!' });
    expect(toast.success).toHaveBeenCalledWith('Done!');
  });

  it('does nothing when displaySuccessToast is false', () => {
    handleSuccessToast({ displaySuccessToast: false, responseMessage: 'something' });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('does nothing when both messages are absent', () => {
    handleSuccessToast({ displaySuccessToast: true });
    expect(toast.success).not.toHaveBeenCalled();
  });
});
