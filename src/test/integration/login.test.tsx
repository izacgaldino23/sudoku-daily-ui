import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/pages/login/Login";
import { renderWithProviders, clearTestStores } from "../setup/test-query-client";

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockedUsedNavigate,
	};
});

describe("Login Page", () => {
	beforeEach(() => {
		clearTestStores();
	});

	it("renders login form by default", () => {
		renderWithProviders(<Login />);

		expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /access/i })).toBeInTheDocument();
		expect(screen.queryByText(/don't have an account/i)).toBeInTheDocument();
	});

	it("shows validation errors for empty form submission", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.type(screen.getByLabelText(/email/i), "a@b.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-invalid");
		await user.click(screen.getByRole("button", { name: /access/i }));

		const errorMessage = await screen.findByText(/email must be at least 8 characters/i);
		expect(errorMessage).toBeInTheDocument();
	});

	it("shows error for invalid credentials", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.type(screen.getByLabelText(/email/i), "wrongemail@example.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-invalid");
		await user.click(screen.getByRole("button", { name: /access/i }));

		const errorMessage = await screen.findByText(/unauthorized/i, {});
		expect(errorMessage).toBeInTheDocument();
	});

	it("logs in successfully with valid credentials", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.type(screen.getByLabelText(/email/i), "testhello@example.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-valid");
		await user.click(screen.getByRole("button", { name: /access/i }));

		await waitFor(() => {
			expect(screen.queryByText(/successfully logged in/i)).toBeInTheDocument();
		});

		const { useAuthStore } = await import("@/store/useAuthStore");
		const authState = useAuthStore.getState().state;
		expect(authState).toEqual({
			accessToken: "mock-access-token",
			refreshToken: "mock-refresh-token",
			username: "testuser",
			email: "testhello@example.com",
		});
	});

	it("toggles to register form", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
		});
	});

	it("shows validation error for short username in register", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText(/username/i), "short");
		await user.type(screen.getByLabelText(/email/i), "testhello@example.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-valid");
		await user.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(screen.queryByText(/username must be at least 8 characters/i)).toBeInTheDocument();
		});
	});

	it("shows error when email already in use", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText(/username/i), "newuservalid");
		await user.type(screen.getByLabelText(/email/i), "testhello@example.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-invalid");
		await user.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(screen.queryByText(/email already in use/i)).toBeInTheDocument();
		});
	});

	it("registers successfully with valid data", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		});

		await user.type(screen.getByLabelText(/username/i), "newuser123");
		await user.type(screen.getByLabelText(/email/i), "new@example.com");
		await user.type(screen.getByLabelText(/password/i), "some-password-valid");
		await user.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(screen.queryByText(/successfully registered/i)).toBeInTheDocument();
		});
	});

	it("clears form when toggling between login and register", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		await user.type(screen.getByLabelText(/email/i), "test@example.com");
		await user.type(screen.getByLabelText(/password/i), "password123");

		await user.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
			expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe("");
			expect((screen.getByLabelText(/password/i) as HTMLInputElement).value).toBe("");
		});
	});
});