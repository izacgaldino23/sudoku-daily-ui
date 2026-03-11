const STORAGE_KEY = "sudoku_session_id";

function getStoredSession(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(STORAGE_KEY);
}

function setStoredSession(id: string | null): void {
	if (typeof window === "undefined") return;
	if (id) {
		localStorage.setItem(STORAGE_KEY, id);
	} else {
		localStorage.removeItem(STORAGE_KEY);
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
