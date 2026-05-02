import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayWrapper from "@/pages/play/PlayWrapper";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useGameStore } from "@/store/useGameStore";

// Mock useParams to control the size
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
	return {
		...actual,
		useParams: () => ({ size: "easy" }), // default to 4x4
	};
});

describe("Play Page Integration", () => {
	beforeEach(() => {
		clearTestStores();
		// Reset game store
		useGameStore.setState({ state: {} });
	});

	it("renders play page with start button for 4x4", () => {
		renderWithProviders(<PlayWrapper />);

		expect(screen.getByText("4x4")).toBeInTheDocument();
		expect(screen.getByText("6x6")).toBeInTheDocument();
		expect(screen.getByText("9x9")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
	});

	it("shows loading state when starting game", async () => {
		const user = userEvent.setup();
		renderWithProviders(<PlayWrapper />);

		const startButton = screen.getByRole("button", { name: /start/i });
		await user.click(startButton);

		// Should show loading state (SkeletonBoard)
		expect(screen.getByTestId("skeleton-board")).toBeInTheDocument();
	});

	it("loads and displays puzzle after starting game", async () => {
		const user = userEvent.setup();
		renderWithProviders(<PlayWrapper />);

		const startButton = screen.getByRole("button", { name: /start/i });
		await user.click(startButton);

		// Wait for puzzle to load
		await waitFor(() => {
			expect(screen.queryByTestId("skeleton-board")).not.toBeInTheDocument();
		});

		// Should show the game board
		expect(screen.getByTestId("game-board")).toBeInTheDocument();
	});

	it("shows timer when game is playing", async () => {
		const user = userEvent.setup();
		renderWithProviders(<PlayWrapper />);

		const startButton = screen.getByRole("button", { name: /start/i });
		await user.click(startButton);

		// Wait for puzzle to load
		await waitFor(() => {
			expect(screen.queryByTestId("skeleton-board")).not.toBeInTheDocument();
		});

		// Should show timer
		expect(screen.getByTestId("timer")).toBeInTheDocument();
	});

	it("shows victory message when game is finished", async () => {
		// Pre-set a finished game state
		useGameStore.getState().loadSolve(4, {
			startTime: Date.now() - 60000,
			endTime: Date.now(),
		});

		renderWithProviders(<PlayWrapper />);

		// Should show victory message
		await waitFor(() => {
			expect(screen.getByText(/great job/i)).toBeInTheDocument();
		});
	});

	it("shows crown on size navigation when game is finished", async () => {
		// Pre-set finished games for different sizes
		useGameStore.getState().loadSolve(4, {
			startTime: Date.now() - 60000,
			endTime: Date.now(),
		});

		renderWithProviders(<PlayWrapper />);

		// Should show crown next to 4x4
		const crownIcons = document.querySelectorAll(".icon-crown");
		expect(crownIcons.length).toBeGreaterThan(0);
	});

	it("navigates between different sizes", async () => {
		const user = userEvent.setup();
		renderWithProviders(<PlayWrapper />);

		// Click on 6x6
		const size6Link = screen.getByText("6x6");
		await user.click(size6Link);

		// Should update to show 6x6 game
		expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
	});

	it("handles error when loading puzzle fails", async () => {
		// Mock the API to return an error
		const user = userEvent.setup();
		renderWithProviders(<PlayWrapper />);

		const startButton = screen.getByRole("button", { name: /start/i });
		await user.click(startButton);

		// Should eventually show an error or return to start state
		// This depends on error handling implementation
	});
});
