export type ApiErrorType = Error & { status: number; code?: string; name: "ApiError" };
export type NetworkErrorType = Error & { name: "NetworkError" };
export type ValidationErrorType = Error & { name: "ValidationError" };

export function createApiError(message: string, status: number, code?: string): ApiErrorType {
	const error = new Error(message) as ApiErrorType;
	error.name = "ApiError";
	error.status = status;
	error.code = code;
	return error;
}

export function createNetworkError(message: string): NetworkErrorType {
	const error = new Error(message) as NetworkErrorType;
	error.name = "NetworkError";
	return error;
}

export function createValidationError(message: string): ValidationErrorType {
	const error = new Error(message) as ValidationErrorType;
	error.name = "ValidationError";
	return error;
}

export function isApiError(error: unknown): error is ApiErrorType {
	return error instanceof Error && (error as ApiErrorType).name === "ApiError";
}

export function isNetworkError(error: unknown): error is NetworkErrorType {
	return error instanceof Error && (error as NetworkErrorType).name === "NetworkError";
}

export function isValidationError(error: unknown): error is ValidationErrorType {
	return error instanceof Error && (error as ValidationErrorType).name === "ValidationError";
}

export function getErrorMessage(error: unknown): string {
	if (!error) return "";
	
	if (isNetworkError(error)) {
		return "Sem conexão com o servidor";
	}
	if (isValidationError(error)) {
		return error.message;
	}
	if (isApiError(error)) {
		if (error.status === 401) return "Unauthorized";
		if (error.status === 403) return "Acesso negado";
		if (error.status === 404) return "Recurso não encontrado";
		if (error.status === 500) return "Erro no servidor";
		return error.message;
	}
	return "Erro desconhecido";
}
