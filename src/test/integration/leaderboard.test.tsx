import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Leaderboard from "@/pages/leaderboard/Leaderboard";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useAuthStore } from "@/store/useAuthStore";

describe("Leaderboard Page Integration", () => {
	beforeEach(() => {
		clearTestStores();
		useAuthStore.getState().logout();
	});

	it("renders leaderboard with title", async () => {
		renderWithProviders(<Leaderboard />);

		await waitFor(() => {
			expect(screen.getByText("Leaderboard")).toBeInTheDocument();
		});
	});

	it("renders filter groups", async () => {
		renderWithProviders(<Leaderboard />);

		await waitFor(() => {
			expect(screen.getByText("Type:")).toBeInTheDocument();
		});
	});

	it("loads and displays leaderboard data", async () => {
		renderWithProviders(<Leaderboard />);

		// Wait for data to load
		await waitFor(() => {
			expect(screen.getByText("player1")).toBeInTheDocument();
		});

		expect(screen.getByText("player2")).toBeInTheDocument();
		expect(screen.getByText("player3")).toBeInTheDocument();
	});

	it("switches between types", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Leaderboard />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText("player1")).toBeInTheDocument();
		});

		// Click on "All Time" filter
		const allTimeButton = screen.getByText("All Time");
		await user.click(allTimeButton);

		// Should update the view
		await waitFor(() => {
			expect(screen.getByText("player1")).toBeInTheDocument();
		});
	});

	it("shows size filter for daily and all-time types", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Leaderboard />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText("Size:")).toBeInTheDocument();
		});

		// Click on "All Time" - should still show size filter
		const allTimeButton = screen.getByText("All Time");
		await user.click(allTimeButton);

		await waitFor(() => {
			expect(screen.getByText("Size:")).toBeInTheDocument();
		});
	});

	it("hides size filter for streak and total types", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Leaderboard />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText("Type:")).toBeInTheDocument();
		});

		// Click on "Streak" - should hide size filter
		const streakButton = screen.getByText("Streak");
		await user.click(streakButton);

		await waitFor(() => {
			expect(screen.queryByText("Size:")).not.toBeInTheDocument();
		});
	});
});
