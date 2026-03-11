import { env } from "@/config/env";
import { getSessionID, setSessionID } from "@/context/sessionStore";

interface FetchRequest {
	url: string;
	params?: Record<string, string>;
}

export async function apiFetch<T>({ url }: FetchRequest): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	}

	const sessionID = getSessionID();
	if (sessionID) {
		headers["X-Session-Id"] = sessionID;
	}
	
	const response = await fetch(`${env.apiUrl}${url}`, {
		headers
	});

	const newSessionId = response.headers.get("X-Session-Id");
	if (newSessionId) {
		setSessionID(newSessionId);
	}

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}
