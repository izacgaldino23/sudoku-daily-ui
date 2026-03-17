export type AuthData = {
	accessToken: string;
	refreshToken: string;
	username: string;
	email: string;
}

export type RegisterRequest = {
	username: string;
	email: string;
	password: string;
}

export type LoginRequest = {
	email: string;
	password: string;
}

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	username: string;
	email: string;
}

export type RefreshResponse = {
	accessToken: string;
}