import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";

vi.mock("@/config/env", () => ({
	env: { apiUrl: "http://localhost:3000" },
}));

describe("useAuthStore - lastRefreshedAt", () => {
	beforeEach(() => {
		useAuthStore.getState().logout();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should initialize with lastRefreshedAt as null", () => {
		const state = useAuthStore.getState();
		expect(state.lastRefreshedAt).toBeNull();
	});

	it("should set lastRefreshedAt on login", () => {
		const now = Date.now();
		vi.spyOn(Date, "now").mockReturnValue(now);

		useAuthStore.getState().login({
			accessToken: "token",
			username: "test",
			email: "test@test.com",
		});

		const state = useAuthStore.getState();
		expect(state.lastRefreshedAt).toBe(now);
	});

	it("should update lastRefreshedAt on updateAccessToken", () => {
		const now = Date.now();
		vi.spyOn(Date, "now").mockReturnValue(now);

		useAuthStore.getState().login({
			accessToken: "token",
			username: "test",
			email: "test@test.com",
		});

		const now2 = Date.now() + 1000;
		vi.spyOn(Date, "now").mockReturnValue(now2);

		useAuthStore.getState().updateAccessToken("new-token");

		const state = useAuthStore.getState();
		expect(state.lastRefreshedAt).toBe(now2);
		expect(state.state?.accessToken).toBe("new-token");
	});

	it("should clear lastRefreshedAt on logout", () => {
		useAuthStore.getState().login({
			accessToken: "token",
			username: "test",
			email: "test@test.com",
		});

		useAuthStore.getState().logout();

		const state = useAuthStore.getState();
		expect(state.lastRefreshedAt).toBeNull();
		expect(state.state).toBeNull();
	});
});
