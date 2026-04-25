import type { RequestConfig } from "@/types/api/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useAlertStore } from "@/store/useAlertStore";
import { refresh } from "@/services/authApi";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export async function authInterceptor(config: RequestConfig): Promise<void> {
	const authState = useAuthStore.getState().state;

	if (authState?.accessToken) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${authState.accessToken}`,
		};
	}
}

export async function tryRefreshToken(): Promise<boolean> {
	const authState = useAuthStore.getState().state;
	if (!authState?.refreshToken) return false;

	if (isRefreshing) {
		await refreshPromise;
		return !!useAuthStore.getState().state?.accessToken;
	}

	isRefreshing = true;
	refreshPromise = (async () => {
		try {
			const response = await refresh(authState.refreshToken);
			useAuthStore.getState().updateAccessToken(response.access_token);
		} catch {
			useAlertStore.getState().pushAlert("Session expired. Please login again.", "warning");
			useAuthStore.getState().logout();
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	await refreshPromise;
	return !!useAuthStore.getState().state?.accessToken;
}
