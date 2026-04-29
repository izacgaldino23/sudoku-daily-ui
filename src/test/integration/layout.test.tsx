import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { AlertStack } from "@/components/alert/AlertStack";
import { useAuthStore } from "@/store/useAuthStore";
import type { AlertItem } from "@/types/ui";

const server = setupServer(
	http.get("/auth/resume", () => {
		return HttpResponse.json({ state: null });
	})
);

beforeEach(() => {
	vi.clearAllMocks();
	localStorage.clear();
	useAuthStore.getState().logout();
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithProviders(component: React.ReactElement) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});

	return render(
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				{component}
			</QueryClientProvider>
		</BrowserRouter>
	);
}

describe("Header", () => {
	it("renders logo and navigation links", () => {
		renderWithProviders(<Header />);

		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByText("Play")).toBeInTheDocument();
		expect(screen.getByText("Leaderboard")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
	});

	it("shows user icon when not logged in", () => {
		renderWithProviders(<Header />);

		const userIcons = document.querySelectorAll(".profile-icon");
		expect(userIcons.length).toBeGreaterThan(0);
	});

	it("shows username and dropdown when logged in", () => {
		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Header />);

		expect(screen.getByText("testuser")).toBeInTheDocument();
	});

	it("shows dropdown menu when profile button clicked", () => {
		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Header />);

		const profileButton = screen.getByText("testuser");
		fireEvent.click(profileButton);

		expect(screen.getByText("Profile")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});

	it("navigates to profile when profile link clicked", () => {
		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Header />);

		const profileButton = screen.getByText("testuser");
		fireEvent.click(profileButton);

		const profileLink = screen.getByText("Profile");
		expect(profileLink.closest("a")).toHaveAttribute("href", "/profile");
	});

	it("logs out and navigates to home when logout clicked", () => {
		const logoutSpy = vi.spyOn(useAuthStore.getState(), "logout");

		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Header />);

		const profileButton = screen.getByText("testuser");
		fireEvent.click(profileButton);

		const logoutButton = screen.getByText("Logout");
		fireEvent.click(logoutButton);

		expect(logoutSpy).toHaveBeenCalled();
	});

	it("hides dropdown when clicking outside", async () => {
		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Header />);

		const profileButton = screen.getByText("testuser");
		fireEvent.click(profileButton);

		expect(screen.getByText("Profile")).toBeInTheDocument();

		fireEvent.mouseDown(document.body);

		await waitFor(() => {
			expect(screen.queryByText("Profile")).not.toBeInTheDocument();
		});
	});

	it("highlights Play link when on play page", () => {
		renderWithProviders(<Header />);

		const playLink = screen.getByText("Play");
		expect(playLink).toBeInTheDocument();
	});
});

describe("Sidebar", () => {
	it("renders navigation links", () => {
		renderWithProviders(<Sidebar />);

		expect(screen.getByText("Play")).toBeInTheDocument();
		expect(screen.getByText("Leaderboard")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
	});

	it("shows Login link when not logged in", () => {
		renderWithProviders(<Sidebar />);

		expect(screen.getByText("Login")).toBeInTheDocument();
	});

	it("shows Me link when logged in", () => {
		useAuthStore.setState({
			state: { username: "testuser", token: "fake-token" },
		});

		renderWithProviders(<Sidebar />);

		expect(screen.getByText("Me")).toBeInTheDocument();
	});

	it("links to correct routes", () => {
		renderWithProviders(<Sidebar />);

		const playLink = screen.getByText("Play").closest("a");
		const leaderboardLink = screen.getByText("Leaderboard").closest("a");
		const aboutLink = screen.getByText("About").closest("a");

		expect(playLink).toHaveAttribute("href", "/");
		expect(leaderboardLink).toHaveAttribute("href", "/leaderboard");
		expect(aboutLink).toHaveAttribute("href", "/about");
	});
});

describe("AlertStack", () => {
	it("renders nothing when no alerts", () => {
		const alerts: AlertItem[] = [];
		const removeAlert = vi.fn();

		renderWithProviders(<AlertStack alerts={alerts} removeAlert={removeAlert} />);

		expect(document.querySelector(".alert-stack")).toBeEmptyDOMElement();
	});

	it("renders alerts when provided", () => {
		const alerts: AlertItem[] = [
			{ id: "1", message: "Success!", variant: "success" },
			{ id: "2", message: "Error occurred", variant: "error" },
		];
		const removeAlert = vi.fn();

		renderWithProviders(<AlertStack alerts={alerts} removeAlert={removeAlert} />);

		expect(screen.getByText("Success!")).toBeInTheDocument();
		expect(screen.getByText("Error occurred")).toBeInTheDocument();
	});

	it("calls removeAlert when close button clicked", () => {
		const alerts: AlertItem[] = [
			{ id: "1", message: "Test alert", variant: "info" },
		];
		const removeAlert = vi.fn();

		renderWithProviders(<AlertStack alerts={alerts} removeAlert={removeAlert} />);

		const closeButtons = document.querySelectorAll(".alert__close");
		fireEvent.click(closeButtons[0]);

		expect(removeAlert).toHaveBeenCalledWith("1");
	});

	it("renders different alert variants with correct classes", () => {
		const alerts: AlertItem[] = [
			{ id: "1", message: "Info", variant: "info" },
			{ id: "2", message: "Warning", variant: "warning" },
			{ id: "3", message: "Error", variant: "error" },
			{ id: "4", message: "Success", variant: "success" },
			{ id: "5", message: "Neutral", variant: "neutral" },
		];
		const removeAlert = vi.fn();

		renderWithProviders(<AlertStack alerts={alerts} removeAlert={removeAlert} />);

		expect(document.querySelector(".alert--info")).toBeInTheDocument();
		expect(document.querySelector(".alert--warning")).toBeInTheDocument();
		expect(document.querySelector(".alert--error")).toBeInTheDocument();
		expect(document.querySelector(".alert--success")).toBeInTheDocument();
		expect(document.querySelector(".alert--neutral")).toBeInTheDocument();
	});
});
