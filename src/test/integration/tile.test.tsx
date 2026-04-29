import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/game/board/Board";

describe("Tile Component Integration", () => {
	beforeEach(() => {
		clearTestStores();
	});

	const setupBoard = (size: number, values: { row: number; col: number; value: number }[]) => {
		const board = Array(size).fill(null).map(() => Array(size).fill(0));
		const fixed = Array(size).fill(null).map(() => Array(size).fill(false));

		values.forEach(({ row, col, value }) => {
			board[row][col] = value;
			fixed[row][col] = true;
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

	it("renders tile with value", async () => {
		setupBoard(4, [{ row: 0, col: 0, value: 5 }]);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			expect(screen.getByText("5")).toBeInTheDocument();
		});
	});

	it("applies filled class for fixed cells", async () => {
		setupBoard(4, [{ row: 0, col: 0, value: 5 }]);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="0"][data-y="0"]');
			expect(tile).toHaveClass("filled");
		});
	});

	it("applies selected class when cell is selected", async () => {
		setupBoard(4, [{ row: 1, col: 1, value: 3 }]);

		const store = useGameStore.getState();
		store.selectCell(4, { row: 1, col: 1 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="1"][data-y="1"]');
			expect(tile).toHaveClass("selected");
		});
	});

	it("shows empty tile for value 0", async () => {
		setupBoard(4, []);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tiles = document.querySelectorAll("[data-x]");
			expect(tiles.length).toBe(16);
		});
	});

	it("applies conflict class for conflicting cells", async () => {
		const store = useGameStore.getState();
		const board = Array(4).fill(null).map(() => Array(4).fill(0));
		const fixed = Array(4).fill(null).map(() => Array(4).fill(false));

		// Create a conflict in row 0
		board[0][0] = 1;
		board[0][1] = 1; // Conflict!
		fixed[0][0] = true;
		fixed[0][1] = false;

		store.setPuzzle(4, {
			session_token: "test-token",
			size: 4,
			board,
			fixed,
		});

		store.setValue(4, { row: 0, col: 1, value: 1 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tile = document.querySelector('[data-x="1"][data-y="0"]');
			expect(tile).toHaveClass("conflict");
		});
	});
});
