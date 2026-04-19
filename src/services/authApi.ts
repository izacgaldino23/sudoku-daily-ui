import type { LoginRequest, LoginResponse, ProfileResume, RefreshResponse, RegisterRequest } from "@/types/api/auth";
import { sessionInterceptor } from "./api/interceptors/session";
import { authInterceptor } from "./api/interceptors/auth";
import { apiFetch, apiPost } from "./api/client";

const interceptors = [sessionInterceptor, authInterceptor];

export async function registerUser(request: RegisterRequest): Promise<void> {
	return apiPost<void>({
		url: `/auth/register`,
		data: request,
	}, interceptors);
}

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
	return apiPost<LoginResponse>({
		url: `/auth/login`,
		data: request,
	}, interceptors);
}

export async function refresh(refresh_token: string): Promise<RefreshResponse> {
	return apiPost<RefreshResponse>({
		url: `/auth/refresh`,
		data: { refresh_token },
	}, [sessionInterceptor]);
}

export async function profileResume(): Promise<ProfileResume> {
	return apiFetch<ProfileResume>({
		url: `/auth/resume`,
		requiresAuth: true,
	}, interceptors);
}
