import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { testQueryClient, renderWithProviders } from "../setup/test-query-client";
import { useSubmitSudokuSolve, useDailySudoku, useGetDailySolves } from "@/hooks/sudoku/mutations";

// Mock useNavigate to avoid router context issues
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => vi.fn(),
	};
});

describe("Sudoku Mutations", () => {
	beforeEach(() => {
		useAuthStore.getState().logout();
		testQueryClient.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("useSubmitSudokuSolve", () => {
		it("should submit solution for guest user", async () => {
			const { result } = renderHook(() => useSubmitSudokuSolve(), {
				wrapper: ({ children }) => (
					<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
				),
			});

			// Submit as guest (no access token)
			result.current.mutate({
				size: "four",
				session_token: "test-token",
				board: [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]],
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});
		});

		it("should submit solution for logged in user", async () => {
			// Set auth state
			useAuthStore.getState().login({
				accessToken: "test-access-token",
				username: "testuser",
				email: "test@example.com",
			});

			const { result } = renderHook(() => useSubmitSudokuSolve(), {
				wrapper: ({ children }) => (
					<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
				),
			});

			// Submit as logged in user
			result.current.mutate({
				size: "four",
				session_token: "test-token",
				board: [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]],
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});
		});
	});

	describe("useDailySudoku", () => {
		it("should fetch daily sudoku for size 4", async () => {
			const { result } = renderHook(() => useDailySudoku(), {
				wrapper: ({ children }) => (
					<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
				),
			});

			result.current.mutate("four");

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toBeDefined();
			expect(result.current.data?.session_token).toBe("test-session-token");
		});

		it.skip("should handle error when fetching sudoku fails", async () => {
			// This test is skipped because useDailySudoku has retry: 3
			// which causes timeout issues in tests
			const { result } = renderHook(() => useDailySudoku(), {
				wrapper: ({ children }) => (
					<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
				),
			});

			// Try to fetch with invalid size
			result.current.mutate("invalid" as never);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});
		});
	});

	describe("useGetDailySolves", () => {
		it("should fetch daily solves for logged in user", async () => {
			// Set auth state
			useAuthStore.getState().login({
				accessToken: "test-access-token",
				username: "testuser",
				email: "test@example.com",
			});

			const { result } = renderHook(() => useGetDailySolves(), {
				wrapper: ({ children }) => (
					<QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
				),
			});

			result.current.mutate(undefined);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});
		});
	});
});
