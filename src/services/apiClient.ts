import { env } from "@/config/env";
import { useSessionStore } from "@/store/useSessionStore";
import { createApiError, createNetworkError } from "@/types/errors";

const sessionHeader = "X-Session-Id";

interface FetchRequest {
	url: string;
	params?: Record<string, string>;
}

interface PostRequest {
	url: string;
	data: Record<string, unknown>;
}

export async function apiFetch<T>({ url, params }: FetchRequest): Promise<T> {
	const sessionID = useSessionStore.getState().sessionID;
	const setSessionID = useSessionStore.getState().setSessionID;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Request-Id": crypto.randomUUID(),
	}

	if (sessionID) {
		headers[sessionHeader] = sessionID;
	}

	if (params) {
		url = `${url}?${new URLSearchParams(params).toString()}`;
	}
	
	try {
		const response = await fetch(`${env.apiUrl}${url}`, {
			headers
		});

		const text = await response.text();
		const parsed = text ? safeJsonParse(text) : null;

		const newSessionId = response.headers.get(sessionHeader);
		if (newSessionId) {
			setSessionID(newSessionId);
		}

		if (!response.ok) {
			throw createApiError(
				parsed?.message || `API Error: ${response.statusText}`,
				response.status,
				undefined,
				parsed?.validation_errors
			);
		}

		return parsed as T;
	} catch (error) {
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}
		throw createNetworkError("Network error");
	}
}

export async function apiPost<T = void>({ url, data }: PostRequest): Promise<T> {
	const sessionID = useSessionStore.getState().sessionID;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Request-Id": crypto.randomUUID(),
	}

	if (sessionID) {
		headers[sessionHeader] = sessionID;
	}
	
	try {
		const response = await fetch(`${env.apiUrl}${url}`, {
			method: "POST",
			headers,
			body: JSON.stringify(data)
		});

		const text = await response.text();
		const parsed = text ? safeJsonParse(text) : null;

		if (!response.ok) {
			throw createApiError(
				parsed?.message || `API Error: ${response.statusText}`,
				response.status,
				undefined,
				parsed?.validation_errors
			);
		}

		if ([204, 201].includes(response.status) || !text || text === "OK") {
			return {} as T;
		}

		return parsed as T;
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