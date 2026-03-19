import { loginUser, registerUser } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { ApiErrorType, NetworkErrorType, ValidationErrorType } from "@/types/errors";

type AuthError = ApiErrorType | NetworkErrorType | ValidationErrorType;

const MUTATION_CONFIG: Pick<UseMutationOptions<unknown, AuthError, unknown, unknown>, "retry" | "retryDelay"> = {
	retry: 3,
	retryDelay: 1000,
};

export function useRegisterUser() {
	return useMutation({
		mutationFn: registerUser,
		...MUTATION_CONFIG,
		mutationKey: ["auth", "register"],
	});
}

export function useLoginUser() {
	return useMutation({
		mutationFn: loginUser,
		...MUTATION_CONFIG,
		mutationKey: ["auth", "login"],
	});
}