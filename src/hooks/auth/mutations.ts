import { loginUser, registerUser } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_CONFIG } from "../config";

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