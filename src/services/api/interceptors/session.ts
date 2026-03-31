import type { RequestConfig } from "@/types/api/api";
import { sessionHeader } from "@/types/api/api";
import { useSessionStore } from "@/store/useSessionStore";

export function sessionInterceptor(config: RequestConfig): void {
	const sessionID = useSessionStore.getState().sessionID;
	
	if (sessionID) {
		config.headers = {
			...config.headers,
			[sessionHeader]: sessionID,
		};
	}
}

export function handleSessionResponse(response: Response): void {
	const newSessionId = response.headers.get(sessionHeader);
	if (newSessionId) {
		useSessionStore.getState().setSessionID(newSessionId);
	}
}
