import type { GameState } from "@/types/GameTypes";

const SESSION_KEY = "sudoku_session_id";
const GAME_STATE_KEY = "sudoku_game_state";

function getStoredSession(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(SESSION_KEY);
}

function setStoredSession(id: string | null): void {
	if (typeof window === "undefined") return;
	if (id) {
		localStorage.setItem(SESSION_KEY, id);
	} else {
		localStorage.removeItem(SESSION_KEY);
	}
}

function getStoredGameState(): GameState | null {
	if (typeof window === "undefined") return null;
	const stored = localStorage.getItem(GAME_STATE_KEY);
	if (!stored) return null;
	try {
		return JSON.parse(stored) as GameState;
	} catch {
		return null;
	}
}

function setStoredGameState(state: GameState | null): void {
	if (typeof window === "undefined") return;
	if (state) {
		localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
	} else {
		localStorage.removeItem(GAME_STATE_KEY);
	}
}

let sessionID: string | null = getStoredSession();
let gameState: GameState | null = getStoredGameState();

export function getSessionID() {
	return sessionID;
}

export function setSessionID(id: string | null) {
	sessionID = id;
	setStoredSession(id);
}

export function getGameState() {
	return gameState;
}

export function setGameState(state: GameState | null) {
	gameState = state;
	setStoredGameState(state);
}
