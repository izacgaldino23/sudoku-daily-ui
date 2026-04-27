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
];