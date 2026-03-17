import { loginUser, refresh, registerUser } from "@/services/authApi";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useRegisterUser() {
	const mutation =  useMutation({
		mutationFn: (data: RegisterRequest) => registerUser(data),
		retry: 3,
		retryDelay: 1000,
	})

	return { ...mutation}
}

export function useLoginUser() {
	const mutation =  useMutation({
		mutationFn: (data: LoginRequest) => loginUser(data),
		retry: 3,
		retryDelay: 1000,
	})

	return { ...mutation}
}

export function useRefresh() {
	const mutation =  useMutation({
		mutationFn: (data: string) => refresh(data),
		retry: 3,
		retryDelay: 1000,
	})

	return { ...mutation}
}