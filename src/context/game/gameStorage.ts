import type { GameState } from "@/types/GameTypes";

const GAME_STATE_KEY = "sudoku_game_state";

function getStoredGameState(): GameState | null {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem(GAME_STATE_KEY);
		if (!stored) return null;
		return JSON.parse(stored) as GameState;
	} catch (e) {
		console.error("Failed to get game state from localStorage:", e);
		return null;
	}
}

function setStoredGameState(state: GameState | null): void {
	if (typeof window === "undefined") return;
	try {
		if (state) {
			localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
		} else {
			localStorage.removeItem(GAME_STATE_KEY);
		}
	} catch (e) {
		console.error("Failed to set game state in localStorage:", e);
	}
}

let gameState: GameState | null = getStoredGameState();

export function getGameState() {
	return gameState;
}

export function setGameState(state: GameState | null) {
	gameState = state;
	setStoredGameState(state);
}
