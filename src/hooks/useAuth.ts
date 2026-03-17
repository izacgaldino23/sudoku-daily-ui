import { mapAuthLoginFromResponse } from "@/utils/mappers";
import { useEffect, useRef } from "react";
import { getErrorMessage } from "@/types/errors";
import { useAlertStore } from "@/store/useAlertStore";
import { useLoginUser, useRegisterUser } from "./auth/mutations";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

	type LoginCallback = () => void;
	type RegisterCallback = () => void;

	export function useAuth() {
		const pushAlert = useAlertStore(s => s.pushAlert)

		const registerMutation = useRegisterUser();
		const loginMutation = useLoginUser();

		const errorShownRef = useRef(false);
		const registerRef = useRef(false);
		const loginRef = useRef(false);

		const loginSuccessRef = useRef<LoginCallback | null>(null);
		const registerSuccessRef = useRef<RegisterCallback | null>(null);

		useEffect(() => {
			errorShownRef.current = false;
			registerRef.current = false;
			loginRef.current = false;
		}, []);

		useEffect(() => {
			if (!loginMutation.data) return;

			const dataMapped = mapAuthLoginFromResponse(loginMutation.data);

			useAuthStore.getState().login(dataMapped);
			loginSuccessRef.current?.();
		}, [loginMutation.data]);

		useEffect(() => {
			if (!registerMutation.data) return;

			registerSuccessRef.current?.();
		}, [registerMutation.data]);

		function login(data: LoginRequest, onSuccess?: () => void) {
			if (loginRef.current) return;

			loginRef.current = true;
			loginSuccessRef.current = onSuccess || null;
			
			loginMutation.mutate({
				email: data.email,
				password: data.password,
			}, {
				onError: (err) => {
					loginRef.current = false;
					pushAlert(getErrorMessage(err), "error");
				},
				onSuccess: () => {
					pushAlert("Successfully logged in!", "success")
				}
			});
		}

		function register(data: RegisterRequest, onSuccess?: () => void) {
			if (registerRef.current) return;

			registerRef.current = true;
			registerSuccessRef.current = onSuccess || null;
			
			registerMutation.mutate({
				username: data.username,
				email: data.email,
				password: data.password,
			}, {
				onError: (err) => {
					registerRef.current = false;
					pushAlert(getErrorMessage(err), "error");
				},
				onSuccess: () => {
					pushAlert("Successfully registered!", "success")
				}
			});
		}

	return {
		loading: loginMutation.status == "pending" || registerMutation.status == "pending",
		register,
		login,
	}
}