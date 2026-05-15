import { isApiError } from "@/types/errors";

export function retryOnceOnServerOrNetworkError(failureCount: number, error: unknown): boolean {
	if (failureCount >= 1) {
		return false;
	}

	if (isApiError(error)) {
		return error.status !== undefined && error.status >= 500;
	}

	return true;
}
