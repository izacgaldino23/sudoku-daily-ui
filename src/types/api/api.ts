export const sessionHeader = "X-Session-Id";

export interface RequestConfig {
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: string;
	params?: Record<string, string | number | boolean>;
	requiresAuth?: boolean;
	data?: Record<string, unknown>;
	credentials?: RequestCredentials;
}

export type ApiRequest = Omit<RequestConfig, "method">;
