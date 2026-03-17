import { env } from "@/config/env";
import { useSessionStore } from "@/store/useSessionStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createApiError, createNetworkError } from "@/types/errors";
import { refresh } from "./authApi";

const sessionHeader = "X-Session-Id";

interface FetchRequest {
	url: string;
	params?: Record<string, string>;
	requiresAuth?: boolean;
}

interface PostRequest {
	url: string;
	data: Record<string, unknown>;
	requiresAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function tryRefreshToken(): Promise<boolean> {
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
			useAuthStore.getState().updateToken({
				accessToken: response.accessToken,
				refreshToken: authState.refreshToken,
			});
		} catch {
			useAuthStore.getState().logout();
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	await refreshPromise;
	return !!useAuthStore.getState().state?.accessToken;
}

async function makeRequest<T>(
	url: string,
	options: RequestInit,
	requiresAuth: boolean
): Promise<T> {
	const sessionID = useSessionStore.getState().sessionID;
	const setSessionID = useSessionStore.getState().setSessionID;
	const authState = useAuthStore.getState().state;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Request-Id": crypto.randomUUID(),
		...options.headers as Record<string, string>,
	};

	if (sessionID) {
		headers[sessionHeader] = sessionID;
	}

	if (requiresAuth && authState?.accessToken) {
		headers["Authorization"] = `Bearer ${authState.accessToken}`;
	}

	const response = await fetch(`${env.apiUrl}${url}`, {
		...options,
		headers,
	});

	const newSessionId = response.headers.get(sessionHeader);
	if (newSessionId) {
		setSessionID(newSessionId);
	}

	if (response.status === 401 && requiresAuth) {
		const refreshed = await tryRefreshToken();
		if (refreshed) {
			return makeRequest<T>(url, options, requiresAuth);
		}
		throw createApiError("Session expired", 401);
	}

	const text = await response.text();

	if (!response.ok) {
		const parsed = safeJsonParse(text);
		throw createApiError(
			parsed?.message || `API Error: ${response.statusText}`,
			response.status,
			undefined,
			parsed?.validation_errors
		);
	}

	const parsed = text ? safeJsonParse(text) : null;
	return parsed as T;
}

export async function apiFetch<T>({ url, params, requiresAuth = false }: FetchRequest): Promise<T> {
	if (params) {
		url = `${url}?${new URLSearchParams(params).toString()}`;
	}

	try {
		return await makeRequest<T>(url, { method: "GET", headers: {} }, requiresAuth);
	} catch (error) {
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}
		throw createNetworkError("Network error");
	}
}

export async function apiPost<T = void>({ url, data, requiresAuth = false }: PostRequest): Promise<T> {
	try {
		return await makeRequest<T>(
			url,
			{
				method: "POST",
				headers: {},
				body: JSON.stringify(data),
			},
			requiresAuth
		);
	} catch (error) {
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}
		throw createNetworkError("Network error");
	}
}

function safeJsonParse(text: string) {
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}