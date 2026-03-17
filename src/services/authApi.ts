import type { LoginRequest, LoginResponse, RefreshResponse, RegisterRequest } from "@/types/auth";
import { apiPost } from "./apiClient";

export async function registerUser(request: RegisterRequest): Promise<void> {
	return apiPost<void>({
		url: `/auth/register`,
		data: request,
	});
}

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
	return apiPost<LoginResponse>({
		url: `/auth/login`,
		data: request,
	});
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
	return apiPost<RefreshResponse>({
		url: `/auth/refresh`,
		data: {
			refreshToken
		},
	});
}