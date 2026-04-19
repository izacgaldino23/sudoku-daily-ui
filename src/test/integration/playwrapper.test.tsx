import { describe, beforeEach, vi, it } from "vitest";
import { clearTestStores } from "../setup/test-query-client";

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useParams: () => ({ size: "easy" }),
	};
});

describe("PlayWrapper", () => {
	beforeEach(() => {
		clearTestStores();
	});

	it("redirects to play page", () => {
		// TODO: add assertions
	});
});