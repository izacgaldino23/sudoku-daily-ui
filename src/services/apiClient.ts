import { env } from "@/config/env";
import { getSessionID, setSessionID } from "@/context";

const sessionHeader = "X-Session-Id";

interface FetchRequest {
	url: string;
	params?: Record<string, string>;
}

export async function apiFetch<T>({ url, params }: FetchRequest): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	}

	const sessionID = getSessionID();
	if (sessionID) {
		headers[sessionHeader] = sessionID;
	}

	if (params) {
		url = `${url}?${new URLSearchParams(params).toString()}`;
	}
	
	const response = await fetch(`${env.apiUrl}${url}`, {
		headers
	});

	const newSessionId = response.headers.get(sessionHeader);
	if (newSessionId) {
		setSessionID(newSessionId);
	}

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}
