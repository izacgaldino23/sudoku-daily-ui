import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { buildUrl, applyInterceptors, makeRequest, apiFetch, apiPost } from "@/services/api/client";

vi.mock("@/config/env", () => ({
	env: { apiUrl: "http://localhost:3000" },
}));

vi.mock("@/services/api/interceptors/session", () => ({
	handleSessionResponse: vi.fn(),
}));

vi.mock("@/services/api/interceptors/auth", () => ({
	tryRefreshToken: vi.fn(),
	authInterceptor: vi.fn(),
}));

describe("buildUrl", () => {
	it("builds URL without params", () => {
		const result = buildUrl("http://localhost:3000", { url: "/api/users", method: "GET" });
		expect(result).toBe("http://localhost:3000/api/users");
	});

	it("builds URL with params", () => {
		const result = buildUrl("http://localhost:3000", {
			url: "/api/users",
			method: "GET",
			params: { page: 1, limit: 10 },
		});
		expect(result).toBe("http://localhost:3000/api/users?page=1&limit=10");
	});

	it("skips undefined params", () => {
		const result = buildUrl("http://localhost:3000", {
			url: "/api/users",
			method: "GET",
			// @ts-expect-error - testing undefined values in params
			params: { page: 1, search: undefined },
		});
		expect(result).toBe("http://localhost:3000/api/users?page=1");
	});

	it("converts numeric and boolean params to strings", () => {
		const result = buildUrl("http://localhost:3000", {
			url: "/api/search",
			method: "GET",
			params: { active: true, page: 1 },
		});
		expect(result).toBe("http://localhost:3000/api/search?active=true&page=1");
	});
});

describe("applyInterceptors", () => {
	it("applies interceptors in order", async () => {
		const calls: string[] = [];
		const interceptor = (url: string) => {
			return async () => {
				calls.push(url);
			}
		}
		const interceptors = [
			interceptor("first"),
			interceptor("second"),
		];

		await applyInterceptors({ url: "/test", method: "GET" }, interceptors);
		expect(calls).toEqual(["first", "second"]);
	});

	it("allows interceptors to modify config", async () => {
		const interceptor = async (config: Record<string, unknown>) => {
			config.method = "POST";
		};

		const result = await applyInterceptors({ url: "/test", method: "GET" }, [interceptor as never]);
		expect(result.method).toBe("POST");
	});
});

describe("makeRequest", () => {
	let originalFetch: typeof fetch;

	beforeEach(() => {
		originalFetch = globalThis.fetch;
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.resetAllMocks();
	});

	it("makes successful GET request", async () => {
		const mockData = { id: 1, name: "test" };
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			status: 200,
			statusText: "OK",
			headers: new Headers(),
			text: async () => JSON.stringify(mockData),
		} as Response);

		const result = await makeRequest({ url: "/api/users", method: "GET" }, []);

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:3000/api/users",
			expect.objectContaining({
				method: "GET",
			})
		);
		expect(result).toEqual(mockData);
	});

	it("throws ApiError on non-ok response", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			status: 400,
			statusText: "Bad Request",
			headers: new Headers({ "content-type": "application/json" }),
			text: async () => JSON.stringify({ message: "Validation error" }),
		} as Response);

		await expect(makeRequest({ url: "/api/users", method: "POST" }, [])).rejects.toThrow(
			"Validation error"
		);
	});

	it("throws ApiError on network failure", async () => {
		vi.mocked(fetch).mockRejectedValue(new Error("Network failure"));

		await expect(makeRequest({ url: "/api/users", method: "GET" }, [])).rejects.toThrow(
			"Network failure"
		);
	});

	it("throws ApiError when 401 without auth header", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
			headers: new Headers(),
			text: async () => "",
		} as Response);

		await expect(
			makeRequest({ url: "/api/protected", method: "GET", requiresAuth: true }, [])
		).rejects.toThrow("Session expired");
	});
});

describe("apiFetch", () => {
	let originalFetch: typeof fetch;

	beforeEach(() => {
		originalFetch = globalThis.fetch;
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.resetAllMocks();
	});

	it("makes GET request with correct method", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			status: 200,
			statusText: "OK",
			headers: new Headers(),
			text: async () => JSON.stringify({ data: "test" }),
		} as Response);

		const result = await apiFetch({ url: "/api/users" }, []);

		expect(fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ method: "GET" })
		);
		expect(result).toEqual({ data: "test" });
	});
});

describe("apiPost", () => {
	let originalFetch: typeof fetch;

	beforeEach(() => {
		originalFetch = globalThis.fetch;
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.resetAllMocks();
	});

	it("makes POST request with stringified body", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			status: 201,
			statusText: "Created",
			headers: new Headers(),
			text: async () => JSON.stringify({ id: 1 }),
		} as Response);

		const result = await apiPost({ url: "/api/users", data: { name: "test" } }, []);

		expect(fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ name: "test" }),
			})
		);
		expect(result).toEqual({ id: 1 });
	});

	it("stringifies empty data as empty object", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			status: 201,
			statusText: "Created",
			headers: new Headers(),
			text: async () => "{}",
		} as Response);

		await apiPost({ url: "/api/users" }, []);

		expect(fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				body: "{}",
			})
		);
	});
});