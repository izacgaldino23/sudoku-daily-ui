import { loginUser, registerUser } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";

export function useRegisterUser() {
	return useMutation({
		mutationFn: registerUser,
		retry: false,
		mutationKey: ["auth", "register"],
	});
}

export function useLoginUser() {
	return useMutation({
		mutationFn: loginUser,
		retry: false,
		mutationKey: ["auth", "login"],
	});
}