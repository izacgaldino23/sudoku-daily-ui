import type { UseMutationOptions } from "@tanstack/react-query";
import type { ApiErrorType, NetworkErrorType, ValidationErrorType } from "@/types/errors";

type AppError = ApiErrorType | NetworkErrorType | ValidationErrorType;

export const MUTATION_CONFIG: Pick<UseMutationOptions<unknown, AppError, unknown, unknown>, "retry" | "retryDelay"> = {
	retry: 3,
	retryDelay: 1000,
};

export const QUERY_CONFIG = {
	staleTime: Infinity,
	retry: false,
} as const;
