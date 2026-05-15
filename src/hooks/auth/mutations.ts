import { loginUser, registerUser } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { useErrorHandler } from "../useErrorHandler";
import { retryOnceOnServerOrNetworkError } from "../queryRetry";

export function useRegisterUser() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: registerUser,
		retry: retryOnceOnServerOrNetworkError,
		retryDelay: 1000,
		mutationKey: ["auth", "register"],
		onError: handleError,
	});
}

export function useLoginUser() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: loginUser,
		retry: retryOnceOnServerOrNetworkError,
		retryDelay: 1000,
		mutationKey: ["auth", "login"],
		onError: handleError,
	});
}