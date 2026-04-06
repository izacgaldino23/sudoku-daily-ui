export type ValidationError = {
	field: string;
	message: string;
};

export type ErrorCode = 
	| "invalid_query_param"
	| "invalid_email"
	| "invalid_token"
	| "token_expired"
	| "invalid_credentials"
	| "email_already_registered"
	| "refresh_token_expired"
	| "refresh_token_revoked"
	| "invalid_body"
	| "invalid_solution"
	| "invalid_leaderboard_type"
	| "size_required"
	| "size_not_allowed"
	| "invalid_size"
	| "invalid_limit"
	| "invalid_page"
	| "internal_server_error"
	| "too_many_requests"
	| "already_played"
	| "user_not_found"
	| "sudoku_not_found"
	| "refresh_token_not_found"
	| "solution_not_found"
	| "validation_error";

export const ERROR_CODE_MESSAGES: Record<ErrorCode, string> = {
	invalid_query_param: "Invalid query parameter",
	invalid_email: "Invalid email format",
	invalid_token: "Invalid or missing token",
	token_expired: "Your session has expired. Please log in again",
	invalid_credentials: "Invalid username or password",
	email_already_registered: "This email is already registered",
	refresh_token_expired: "Your session has expired. Please log in again",
	refresh_token_revoked: "Your session has been revoked. Please log in again",
	invalid_body: "Invalid request data",
	invalid_solution: "The solution is incorrect. Please try again",
	invalid_leaderboard_type: "Invalid leaderboard type",
	size_required: "Please select a board size",
	size_not_allowed: "This size is not allowed for the selected leaderboard type",
	invalid_size: "Invalid board size",
	invalid_limit: "Invalid limit value",
	invalid_page: "Invalid page number",
	internal_server_error: "Server error. Please try again later",
	too_many_requests: "Too many requests. Please wait a moment",
	already_played: "You have already played today. Come back tomorrow!",
	user_not_found: "User not found",
	sudoku_not_found: "Sudoku puzzle not found",
	refresh_token_not_found: "Session not found. Please log in",
	solution_not_found: "Solution not found",
	validation_error: "Validation failed. Please check your input",
};

export type ApiErrorType = Error & { 
	name: "ApiError"
	status: number;
	code?: ErrorCode; 
	validationErrors?: ValidationError[];
};

export type NetworkErrorType = Error & { name: "NetworkError" };
export type ValidationErrorType = Error & { name: "ValidationError" };

export function createApiError(
	message: string,
	status: number,
	code?: string,
	validationErrors?: ValidationError[]
): ApiErrorType {
	const error = new Error(message) as ApiErrorType;
	error.name = "ApiError";
	error.status = status;
	error.code = code as ErrorCode | undefined;
	error.validationErrors = validationErrors;
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

export function getErrorMessage(error: Error): string {
	if (!error) return "";
	
	if (isNetworkError(error)) {
		return "Network error. Please check your connection and try again.";
	}
	if (isValidationError(error)) {
		return error.message;
	}
	if (isApiError(error)) {
		if (error.code && ERROR_CODE_MESSAGES[error.code]) {
			return ERROR_CODE_MESSAGES[error.code];
		}

		if (error.validationErrors && error.validationErrors.length > 0) {
			const validationMessages = error.validationErrors
				.map(ve => `${ve.field}: ${ve.message}`)
				.join(" | ");
			return validationMessages;
		}

		if (error.status === 401) return "Unauthorized. Please log in.";
		if (error.status === 403) return "Access forbidden.";
		if (error.status === 404) return "Resource not found.";
		if (error.status === 429) return "Too many requests. Please wait a moment.";
		if (error.status === 500) return "Server error. Please try again later.";
		
		return error.message || "An unexpected error occurred.";
	}

	return error.message;
}