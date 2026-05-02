import { http, HttpResponse, delay } from "msw";

const BASE_URL = "http://localhost:3000";

export const handlers = [
	http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
		await delay(100);
		const body = (await request.json()) as { email: string; password: string };

		if (body.email === "testhello@example.com" && body.password === "some-password-valid") {
			return HttpResponse.json({
				access_token: "mock-access-token",
				username: "testuser",
				email: "testhello@example.com",
			});
		}

		return HttpResponse.json(
			{ message: "Invalid credentials" },
			{ status: 401 }
		);
	}),

	http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
		await delay(100);
		const body = (await request.json()) as {
			username: string;
			email: string;
			password: string;
		};

		if (body.email === "testhello@example.com") {
			return HttpResponse.json(
				{ message: "Email already in use" },
				{ status: 409 }
			);
		}

		if (body.username === "takenuser") {
			return HttpResponse.json(
				{ message: "Username already in use" },
				{ status: 409 }
			);
		}

		return HttpResponse.json(undefined, { status: 201 });
	}),

	http.get(`${BASE_URL}/sudoku`, async ({ request }) => {
		await delay(100);
		const url = new URL(request.url);
		const size = url.searchParams.get("size");

		if (size === "four") {
			return HttpResponse.json({
				session_token: "test-session-token",
				size: 4,
				board: [
					{ row: 0, col: 0, value: 1 },
					{ row: 1, col: 1, value: 2 },
				],
			});
		}

		if (size === "six") {
			return HttpResponse.json({
				session_token: "test-session-token",
				size: 6,
				board: [
					{ row: 0, col: 0, value: 1 },
				],
			});
		}

		if (size === "nine") {
			return HttpResponse.json({
				session_token: "test-session-token",
				size: 9,
				board: [
					{ row: 0, col: 0, value: 5 },
				],
			});
		}

		return HttpResponse.json(
			{ message: "Invalid size" },
			{ status: 400 }
		);
	}),

	http.post(`${BASE_URL}/sudoku/submit`, async () => {
		await delay(100);
		return HttpResponse.json({
			success: true,
			message: "Puzzle solved!",
		});
	}),

	http.post(`${BASE_URL}/sudoku/submit/guest`, async () => {
		await delay(100);
		return HttpResponse.json({
			success: true,
			message: "Puzzle solved!",
		});
	}),

	http.get(`${BASE_URL}/sudoku/me`, async () => {
		await delay(100);
		return HttpResponse.json({
			solves: [],
		});
	}),

	http.get(`${BASE_URL}/leaderboard`, async ({ request }) => {
		await delay(100);
		const url = new URL(request.url);
		const type = url.searchParams.get("type");

		if (type === "daily") {
			return HttpResponse.json({
				has_next: true,
				solves: [
					{ rank: 1, username: "player1", value: "300" },
					{ rank: 2, username: "player2", value: "350" },
					{ rank: 3, username: "player3", value: "400" },
					{ rank: 4, username: "player4", value: "450" },
					{ rank: 5, username: "player5", value: "500" },
				],
			});
		}

		return HttpResponse.json({
			has_next: false,
			solves: [
				{ rank: 1, username: "player1", value: "1000" },
			],
		});
	}),

	http.get(`${BASE_URL}/auth/resume`, async () => {
		await delay(100);
		return HttpResponse.json({
			total_games: { 4: 10, 6: 5, 9: 3 },
			today_games: [
				{ size: 4, finished: true, time: 300 },
				{ size: 6, finished: false, time: 0 },
			],
			best_times: [
				{ size: 4, finished: true, time: 250 },
			],
		});
	}),
];