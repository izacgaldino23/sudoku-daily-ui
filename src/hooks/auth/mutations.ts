import { loginUser, registerUser } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { useErrorHandler } from "../useErrorHandler";

export function useRegisterUser() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: registerUser,
		retry: false,
		mutationKey: ["auth", "register"],
		onError: handleError,
	});
}

export function useLoginUser() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: loginUser,
		retry: false,
		mutationKey: ["auth", "login"],
		onError: handleError,
	});
}