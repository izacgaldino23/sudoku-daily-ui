import { QueryClient } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { TestProviders } from "./test-providers";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionStore } from "@/store/useSessionStore";
import { useAlertStore } from "@/store/useAlertStore";

export const testQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});

export function renderWithProviders(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">
) {
	return render(ui, { wrapper: TestProviders, ...options });
}

export function clearTestStores() {
	useAuthStore.getState().logout();
	useSessionStore.getState().setSessionID(null);
	testQueryClient.clear();
	useAlertStore.getState().alerts = [];
}