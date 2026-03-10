import { env } from "@/config/env";

export async function apiFetch<T>(path: string): Promise<T> {
	const response = await fetch(`${env.apiUrl}${path}`);

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}