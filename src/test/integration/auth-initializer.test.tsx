import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthInitializer } from "@/components/AuthInitializer";

const mockLogout = vi.fn();
const mockNavigate = vi.fn();
const mockUseProactiveRefresh = vi.fn();

vi.mock("@/store/useAuthStore", () => ({
	useAuthStore: vi.fn((selector: (state: { logout: () => void }) => void) => {
		return selector({ logout: mockLogout });
	}),
}));

vi.mock("@/hooks/auth/queries", () => ({
	useProactiveRefresh: () => mockUseProactiveRefresh(),
}));

vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
}));

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
		},
	});
}

describe("AuthInitializer", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		vi.clearAllMocks();
	});

	it("should render nothing (null)", () => {
		mockUseProactiveRefresh.mockReturnValue({ isError: false });

		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<AuthInitializer />
			</QueryClientProvider>
		);

		expect(container.firstChild).toBeNull();
	});

	it("should call logout and navigate on refresh error", () => {
		mockUseProactiveRefresh.mockReturnValue({ isError: true });

		render(
			<QueryClientProvider client={queryClient}>
				<AuthInitializer />
			</QueryClientProvider>
		);

		expect(mockLogout).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
	});

	it("should not call logout when no error", () => {
		mockUseProactiveRefresh.mockReturnValue({ isError: false });

		render(
			<QueryClientProvider client={queryClient}>
				<AuthInitializer />
			</QueryClientProvider>
		);

		expect(mockLogout).not.toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
