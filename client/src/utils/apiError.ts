import type { AxiosError } from "axios";

type ApiErrorBody = {
  error?: string;
  code?: string;
  details?: { fields?: Record<string, string[]> };
};

export function parseApiError(
  err: unknown,
  fallback = "Something went wrong.",
) {
  const data = (err as AxiosError<ApiErrorBody>).response?.data;
  return {
    message: data?.error ?? fallback,
    fieldErrors: data?.details?.fields ?? {},
  };
}
