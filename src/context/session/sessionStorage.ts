const SESSION_KEY = "sudoku_session_id";

function getStoredSession(): string | null {
	if (typeof window === "undefined") return null;
	try {
		return sessionStorage.getItem(SESSION_KEY);
	} catch (e) {
		console.error("Failed to get session from sessionStorage:", e);
		return null;
	}
}

function setStoredSession(id: string | null): void {
	if (typeof window === "undefined") return;
	try {
		if (id) {
			sessionStorage.setItem(SESSION_KEY, id);
		} else {
			sessionStorage.removeItem(SESSION_KEY);
		}
	} catch (e) {
		console.error("Failed to set session in sessionStorage:", e);
	}
}

let sessionID: string | null = getStoredSession();

export function getSessionID() {
	return sessionID;
}

export function setSessionID(id: string | null) {
	sessionID = id;
	setStoredSession(id);
}
