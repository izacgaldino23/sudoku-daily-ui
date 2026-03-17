import { mapAuthLoginFromResponse } from "@/utils/mappers";
import { useEffect, useRef } from "react";
import { getErrorMessage } from "@/services/errors";
import { useAlertStore } from "@/store/useAlertStore";
import { useLoginUser, useRegisterUser } from "./auth/mutations";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginRequest, RegisterRequest } from "@/types/AuthTypes";

export function useAuth() {
	const pushAlert = useAlertStore(s => s.pushAlert)

	const registerMutation = useRegisterUser();
	const loginMutation = useLoginUser();

	const errorShownRef = useRef(false);
	const registerRef = useRef(false);
	const loginRef = useRef(false);

	useEffect(() => {
		errorShownRef.current = false;
		registerRef.current = false;
		loginRef.current = false;
	}, []);

	useEffect(() => {
		if (!loginMutation.data) return;

		const dataMapped = mapAuthLoginFromResponse(loginMutation.data);

		useAuthStore.getState().login(dataMapped);
	}, [loginMutation.data]);

	function login(data: LoginRequest) {
		if (loginRef.current) return;

		loginRef.current = true;
		
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

	function register(data: RegisterRequest) {
		if (registerRef.current) return;

		registerRef.current = true;
		
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