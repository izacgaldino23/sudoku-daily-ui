import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/game/board/Board";

describe("Board Component Integration", () => {
	beforeEach(() => {
		clearTestStores();
	});

	const createBoard = (size: number, values: { row: number; col: number; value: number }[]) => {
		const board = Array(size).fill(null).map(() => Array(size).fill(0));
		const fixed = Array(size).fill(null).map(() => Array(size).fill(false));

		values.forEach(({ row, col, value }) => {
			board[row][col] = value;
			fixed[row][col] = true;
		});

		return { board, fixed };
	};

	it("renders 4x4 grid", async () => {
		const { board, fixed } = createBoard(4, [
			{ row: 0, col: 0, value: 1 },
			{ row: 0, col: 1, value: 2 },
		]);

		const store = useGameStore.getState();
		store.setPuzzle(4, {
			session_token: "test-token",
			size: 4,
			board,
			fixed,
		});

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tiles = document.querySelectorAll("[data-x]");
			expect(tiles.length).toBe(16);
		});
	});

	it("renders 9x9 grid", async () => {
		const { board, fixed } = createBoard(9, []);

		const store = useGameStore.getState();
		store.setPuzzle(9, {
			session_token: "test-token",
			size: 9,
			board,
			fixed,
		});

		renderWithProviders(<Board size={9} />);

		await waitFor(() => {
			const tiles = document.querySelectorAll("[data-x]");
			expect(tiles.length).toBe(81);
		});
	});

	it("displays tile values", async () => {
		const { board, fixed } = createBoard(4, [
			{ row: 0, col: 0, value: 1 },
			{ row: 0, col: 1, value: 2 },
			{ row: 0, col: 2, value: 3 },
			{ row: 0, col: 3, value: 4 },
		]);

		const store = useGameStore.getState();
		store.setPuzzle(4, {
			session_token: "test-token",
			size: 4,
			board,
			fixed,
		});

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const tiles = document.querySelectorAll("[data-x]");
			expect(tiles[0]).toHaveTextContent("1");
			expect(tiles[1]).toHaveTextContent("2");
			expect(tiles[2]).toHaveTextContent("3");
			expect(tiles[3]).toHaveTextContent("4");
		});
	});

	it("shows victory message when complete", async () => {
		const { board, fixed } = createBoard(4, [
			{ row: 0, col: 0, value: 1 },
			{ row: 0, col: 1, value: 2 },
			{ row: 0, col: 2, value: 3 },
			{ row: 0, col: 3, value: 4 },
		]);

		const store = useGameStore.getState();
		store.setPuzzle(4, {
			session_token: "test-token",
			size: 4,
			board,
			fixed,
		});

		// Mock finishGame to set status to FINISHED
		store.finishGame(4);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			expect(screen.getByText("Parabéns!")).toBeInTheDocument();
		});
	});

	it("highlights selected cell", async () => {
		const { board, fixed } = createBoard(4, [
			{ row: 0, col: 0, value: 1 },
		]);

		const store = useGameStore.getState();
		store.setPuzzle(4, {
			session_token: "test-token",
			size: 4,
			board,
			fixed,
		});

		store.selectCell(4, { row: 0, col: 0 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const selectedTile = document.querySelector(".selected");
			expect(selectedTile).toBeInTheDocument();
		});
	});
});
