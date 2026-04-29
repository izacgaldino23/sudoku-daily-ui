import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import Profile from "@/pages/Profile";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";
import { useAuthStore } from "@/store/useAuthStore";

describe("Profile Page Integration", () => {
	beforeEach(() => {
		clearTestStores();
		useAuthStore.getState().login({
			accessToken: "mock-access-token",
			username: "testuser",
			email: "test@example.com",
		});
	});

	it("renders profile title", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText("Profile")).toBeInTheDocument();
		});
	});

	it("displays username", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText(/Welcome,/)).toBeInTheDocument();
		});

		expect(screen.getByText("testuser")).toBeInTheDocument();
	});

	it("shows loading state", async () => {
		renderWithProviders(<Profile />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("loads and displays profile data", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText("4x4")).toBeInTheDocument();
		});

		expect(screen.getByText("6x6")).toBeInTheDocument();
		expect(screen.getByText("9x9")).toBeInTheDocument();
	});

	it("displays total games for each size", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText("10")).toBeInTheDocument();
		});

		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("shows today's game time when finished", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText("5:00")).toBeInTheDocument();
		});
	});

	it("shows dash for unfinished today games", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getAllByText("-").length).toBeGreaterThan(0);
		});
	});

	it("displays best times when available", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			expect(screen.getByText("4:10")).toBeInTheDocument();
		});
	});

	it("shows dash for missing best times", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			const dashes = screen.getAllByText("-");
			expect(dashes.length).toBeGreaterThan(1);
		});
	});

	it("applies has_today class for finished today games", async () => {
		renderWithProviders(<Profile />);

		await waitFor(() => {
			const row = document.querySelector(".has_today");
			expect(row).toBeInTheDocument();
		});
	});
});
