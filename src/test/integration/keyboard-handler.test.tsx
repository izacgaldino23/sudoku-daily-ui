import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/game/board/Board";

describe("useKeyboardHandler Hook", () => {
	beforeEach(() => {
		clearTestStores();
	});

	const setupBoard = (size: number, values: { row: number; col: number; value: number }[], makeFixed = false) => {
		const board = Array(size).fill(null).map(() => Array(size).fill(0));
		const fixed = Array(size).fill(null).map(() => Array(size).fill(false));

		values.forEach(({ row, col, value }) => {
			board[row][col] = value;
			if (makeFixed) fixed[row][col] = true;
		});

		const store = useGameStore.getState();
		store.setPuzzle(size, {
			session_token: "test-token",
			size,
			board,
			fixed,
		});

		return store;
	};

	it("sets value when number key is pressed", async () => {
		const user = userEvent.setup();
		setupBoard(4, [{ row: 0, col: 0, value: 0 }]);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 0, col: 0 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="0"][data-y="0"]');
			expect(tile).toBeInTheDocument();
		});

		// Focus the board
		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("5");

		const state = useGameStore.getState().state[4];
		expect(state?.board[0][0]).toBe(5);

		// Check tile displays the value
		const tile = document.querySelector('[data-x="0"][data-y="0"]');
		expect(tile).toHaveTextContent("5");
	});

	it("clears value when Backspace is pressed", async () => {
		const user = userEvent.setup();
		// Set value 3 but NOT as fixed so it can be cleared
		setupBoard(4, [{ row: 0, col: 0, value: 3 }]);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 0, col: 0 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="0"][data-y="0"]');
			expect(tile).toHaveTextContent("3");
		});

		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("{Backspace}");

		const state = useGameStore.getState().state[4];
		expect(state?.board[0][0]).toBe(0);
	});

	it("moves selection up with ArrowUp", async () => {
		const user = userEvent.setup();
		setupBoard(4, []);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 1, col: 1 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="1"][data-y="1"]');
			expect(tile).toHaveClass("selected");
		});

		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("{ArrowUp}");

		const state = useGameStore.getState().state[4];
		expect(state?.selectedCell).toEqual({ row: 0, col: 1 });
	});

	it("moves selection down with ArrowDown", async () => {
		const user = userEvent.setup();
		setupBoard(4, []);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 0, col: 1 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="1"][data-y="0"]');
			expect(tile).toHaveClass("selected");
		});

		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("{ArrowDown}");

		const state = useGameStore.getState().state[4];
		expect(state?.selectedCell).toEqual({ row: 1, col: 1 });
	});

	it("moves selection left with ArrowLeft", async () => {
		const user = userEvent.setup();
		setupBoard(4, []);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 1, col: 1 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="1"][data-y="1"]');
			expect(tile).toHaveClass("selected");
		});

		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("{ArrowLeft}");

		const state = useGameStore.getState().state[4];
		expect(state?.selectedCell).toEqual({ row: 1, col: 0 });
	});

	it("moves selection right with ArrowRight", async () => {
		const user = userEvent.setup();
		setupBoard(4, []);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 1, col: 0 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="0"][data-y="1"]');
			expect(tile).toHaveClass("selected");
		});

		const boardElement = screen.getByTestId("game-board");
		boardElement.focus();

		await user.keyboard("{ArrowRight}");

		const state = useGameStore.getState().state[4];
		expect(state?.selectedCell).toEqual({ row: 1, col: 1 });
	});
});
