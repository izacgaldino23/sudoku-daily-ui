import { env } from "@/config/env";
import { createApiError, createNetworkError } from "./errors";
import { useSessionStore } from "@/store/useSessionStore";

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

		const newSessionId = response.headers.get(sessionHeader);
		if (newSessionId) {
			setSessionID(newSessionId);
		}

		if (!response.ok) {
			throw createApiError(
				`API Error: ${response.statusText}`,
				response.status
			);
		}

		return response.json();
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

		if (!response.ok) {
			throw createApiError(
				`API Error: ${response.statusText}`,
				response.status
			);
		}

		const text = await response.text();
		if (text === "OK") {
			return {} as T;
		}
		return text ? JSON.parse(text) : ({} as T);
	} catch (error) {
		if (error instanceof Error && error.name === "ApiError") {
			throw error;
		}
		console.log(error);
		throw createNetworkError("Network error");
	}
}