import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { apiPost } from "./apiClient";

export async function registerUser(request: RegisterRequest): Promise<void> {
	return apiPost({
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