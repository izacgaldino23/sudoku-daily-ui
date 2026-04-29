import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useGameStore } from "@/store/useGameStore";
import { Status } from "@/types/game";

// Mock localStorage for zustand persist
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

describe("useGameStore", () => {
	beforeEach(() => {
		// Reset store to initial state by directly setting it
		useGameStore.setState({ state: {} });
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("initial state", () => {
		it("should have empty state object", () => {
			const state = useGameStore.getState();
			expect(state.state).toEqual({});
		});
	});

	describe("loadingGame", () => {
		it("should set loading status for specific size", () => {
			useGameStore.getState().loadingGame(4);

			const state = useGameStore.getState();
			expect(state.state[4]).toEqual({ status: Status.LOADING });
		});

		it("should not affect other sizes when loading", () => {
			useGameStore.getState().loadingGame(9);

			const state = useGameStore.getState();
			expect(state.state[4]).toBeUndefined();
			expect(state.state[9]?.status).toBe(Status.LOADING);
		});
	});

	describe("setPuzzle", () => {
		it("should set puzzle with board, fixed, and session_token", () => {
			const board = [
				[1, 0, 0, 0],
				[0, 2, 0, 0],
				[0, 0, 3, 0],
				[0, 0, 0, 4],
			];
			const fixed = [
				[true, false, false, false],
				[false, true, false, false],
				[false, false, true, false],
				[false, false, false, true],
			];

			useGameStore.getState().setPuzzle(4, {
				board,
				fixed,
				session_token: "test-token",
			});

			const state = useGameStore.getState();
			expect(state.state[4]?.board).toEqual(board);
			expect(state.state[4]?.fixed).toEqual(fixed);
			expect(state.state[4]?.session_token).toBe("test-token");
			expect(state.state[4]?.status).toBe(Status.PLAYING);
			expect(state.state[4]?.selectedCell).toBeNull();
			expect(state.state[4]?.brush).toBeNull();
			expect(state.state[4]?.startTime).toBeDefined();
		});
	});

	describe("selectCell", () => {
		beforeEach(() => {
			// Setup a game first
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should select a cell", () => {
			useGameStore.getState().selectCell(4, { row: 1, col: 2 });

			const state = useGameStore.getState();
			expect(state.state[4]?.selectedCell).toEqual({ row: 1, col: 2 });
		});
	});

	describe("setValue", () => {
		beforeEach(() => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should set value in board", () => {
			useGameStore.getState().setValue(4, { row: 0, col: 0, value: 5 });

			const state = useGameStore.getState();
			expect(state.state[4]?.board[0][0]).toBe(5);
			expect(state.state[4]?.hasInvalidAttempt).toBe(false);
		});

		it("should not set value on fixed cells", () => {
			// Set up a board with a fixed cell
			useGameStore.getState().setPuzzle(4, {
				board: [[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[true,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});

			const beforeValue = useGameStore.getState().state[4]?.board[0][0];
			useGameStore.getState().setValue(4, { row: 0, col: 0, value: 9 });

			const state = useGameStore.getState();
			expect(state.state[4]?.board[0][0]).toBe(beforeValue); // Should not change
		});
	});

	describe("clearValue", () => {
		beforeEach(() => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[5,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should clear value in board", () => {
			useGameStore.getState().clearValue(4, { row: 0, col: 0 });

			const state = useGameStore.getState();
			expect(state.state[4]?.board[0][0]).toBe(0);
			expect(state.state[4]?.hasInvalidAttempt).toBe(false);
		});

		it("should not clear fixed cells", () => {
			useGameStore.getState().setPuzzle(4, {
				board: [[5,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[true,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});

			useGameStore.getState().clearValue(4, { row: 0, col: 0 });

			const state = useGameStore.getState();
			expect(state.state[4]?.board[0][0]).toBe(5); // Should not change
		});
	});

	describe("finishGame", () => {
		beforeEach(() => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should set status to FINISHED and set endTime", () => {
			vi.spyOn(Date, "now").mockReturnValue(1000);

			useGameStore.getState().finishGame(4);

			const state = useGameStore.getState();
			expect(state.state[4]?.status).toBe(Status.FINISHED);
			expect(state.state[4]?.endTime).toBe(1000);
		});
	});

	describe("setBrush and clearBrush", () => {
		beforeEach(() => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should set brush value", () => {
			useGameStore.getState().setBrush(4, 5);

			const state = useGameStore.getState();
			expect(state.state[4]?.brush).toBe(5);
			expect(state.state[4]?.hasInvalidAttempt).toBe(false);
		});

		it("should clear brush", () => {
			useGameStore.getState().setBrush(4, 5);
			useGameStore.getState().clearBrush(4);

			const state = useGameStore.getState();
			expect(state.state[4]?.brush).toBeNull();
			expect(state.state[4]?.hasInvalidAttempt).toBe(false);
		});
	});

	describe("loadSolve", () => {
		it("should load a finished game with start and end times", () => {
			useGameStore.getState().loadSolve(4, {
				startTime: 1000,
				endTime: 2000,
			});

			const state = useGameStore.getState();
			expect(state.state[4]?.status).toBe(Status.FINISHED);
			expect(state.state[4]?.startTime).toBe(1000);
			expect(state.state[4]?.endTime).toBe(2000);
		});
	});

	describe("setInvalidAttempt", () => {
		beforeEach(() => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});
		});

		it("should set hasInvalidAttempt to true", () => {
			useGameStore.getState().setInvalidAttempt(4);

			const state = useGameStore.getState();
			expect(state.state[4]?.hasInvalidAttempt).toBe(true);
		});
	});

	describe("removeGame", () => {
		it("should remove game for specific size", () => {
			useGameStore.getState().loadingGame(4);
			useGameStore.getState().setPuzzle(4, {
				board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
				fixed: [[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],
				session_token: "token",
			});

			useGameStore.getState().removeGame(4);

			const state = useGameStore.getState();
			expect(state.state[4]).toBeNull();
		});
	});
});
