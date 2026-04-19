import { createApiError, createNetworkError } from "@/types/errors";
import type { RequestConfig, ApiRequest } from "@/types/api/api";
import { env } from "@/config/env";
import { handleSessionResponse } from "./interceptors/session";
import { tryRefreshToken } from "./interceptors/auth";

export { env };

export interface Interceptor {
	(prepare: RequestConfig): Promise<void> | void;
}

export async function applyInterceptors(
	config: RequestConfig,
	interceptors: Interceptor[]
): Promise<RequestConfig> {
	for (const interceptor of interceptors) {
		await interceptor(config);
	}
	return config;
}

export function buildUrl(baseUrl: string, config: RequestConfig): string {
	let url = `${baseUrl}${config.url}`;
	if (config.params) {
		const parsedParams: Record<string, string> = {};
		for (const [key, value] of Object.entries(config.params)) {
			if (value === undefined) {
				continue;
			}
			parsedParams[key] = String(value);
		}
		url = `${url}?${new URLSearchParams(parsedParams).toString()}`;
	}
	return url;
}

export async function makeRequest<T>(
	config: RequestConfig,
	interceptors: Interceptor[],
	retry?: boolean,
): Promise<T> {
	const preparedConfig = await applyInterceptors({ ...config }, interceptors);

	const finalHeaders = new Headers(preparedConfig.headers);
	finalHeaders.set("Content-Type", "application/json");

	const response = await fetch(buildUrl(env.apiUrl, preparedConfig), {
		method: preparedConfig.method,
		headers: finalHeaders,
		body: preparedConfig.body,
	});

	handleSessionResponse(response);

	if (response.status === 401 && preparedConfig.requiresAuth) {
		if (finalHeaders.has("Authorization") && !retry) {
			try {
				const refreshed = await tryRefreshToken();
				if (!refreshed) {
					throw createApiError("Session expired and refresh token expired", 401);
				}
				return await makeRequest<T>(config, interceptors, true);
			} catch {
				throw createApiError("Session expired and refresh token expired", 401);
			}
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

export async function apiFetch<T>(
	config: ApiRequest,
	interceptors: Interceptor[]
): Promise<T> {
	try {
		return await makeRequest<T>(
			{ ...config, method: "GET" },
			interceptors
		);
	} catch (error) {
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}
		throw createNetworkError("Network error");
	}
}

export async function apiPost<T>(
	config: ApiRequest,
	interceptors: Interceptor[]
): Promise<T> {
	try {
		return await makeRequest<T>(
			{
				...config,
				method: "POST",
				body: JSON.stringify(config.data ?? {}),
			},
			interceptors
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
