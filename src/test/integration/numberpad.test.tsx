import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/game/board/Board";

describe("NumberPad Component Integration", () => {
	beforeEach(() => {
		clearTestStores();
	});

	const setupBoard = (size: number) => {
		const board = Array(size).fill(null).map(() => Array(size).fill(0));
		const fixed = Array(size).fill(null).map(() => Array(size).fill(false));

		const store = useGameStore.getState();
		store.setPuzzle(size, {
			session_token: "test-token",
			size,
			board,
			fixed,
		});

		return store;
	};

	it("renders correct number of buttons for 4x4", async () => {
		setupBoard(4);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const buttons = screen.getAllByRole("button");
			// 4 number buttons + 1 eraser button
			expect(buttons).toHaveLength(5);
		});
	});

	it("renders correct number of buttons for 9x9", async () => {
		setupBoard(9);

		renderWithProviders(<Board size={9} />);

		await waitFor(() => {
			const buttons = screen.getAllByRole("button");
			// 9 number buttons + 1 eraser button
			expect(buttons).toHaveLength(10);
		});
	});

	it("sets brush when clicking number button", async () => {
		const user = userEvent.setup();
		setupBoard(4);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			expect(screen.getByText("1")).toBeInTheDocument();
		});

		const button1 = screen.getByText("1");
		await user.click(button1);

		const store = useGameStore.getState();
		expect(store.state[4]?.brush).toBe(1);
	});

	it("clears brush when clicking same number twice", async () => {
		const user = userEvent.setup();
		setupBoard(4);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			expect(screen.getByText("1")).toBeInTheDocument();
		});

		const button1 = screen.getByText("1");
		await user.click(button1);
		await user.click(button1);

		const store = useGameStore.getState();
		expect(store.state[4]?.brush).toBeNull();
	});

	it("applies active class to selected brush", async () => {
		const user = userEvent.setup();
		setupBoard(4);

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			expect(screen.getByText("2")).toBeInTheDocument();
		});

		const button2 = screen.getByText("2");
		await user.click(button2);

		expect(button2).toHaveClass("active");
	});

	it("eraser button clears selected cell value", async () => {
		const user = userEvent.setup();
		const store = setupBoard(4);

		// Set a value in a cell
		store.setValue(4, { row: 0, col: 0, value: 3 });
		store.selectCell(4, { row: 0, col: 0 });

		renderWithProviders(<Board size={4} />);

		await waitFor(() => {
			const eraserButton = screen.getByRole("button", { name: "" }); // Eraser has no text
			expect(eraserButton).toBeInTheDocument();
		});

		const eraserButton = screen.getByRole("button", { name: "" });
		await user.click(eraserButton);

		const state = useGameStore.getState().state[4];
		expect(state?.board[0][0]).toBe(0);
	});
});
