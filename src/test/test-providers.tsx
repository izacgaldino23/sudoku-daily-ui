import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAlertStore } from "@/store/useAlertStore";
import { AlertStack } from "@/components/alert/AlertStack";
import { testQueryClient } from "./test-query-client";

export function TestProviders({ children }: { children: ReactNode }) {
	const alerts = useAlertStore((state) => state.alerts);
	const removeAlert = useAlertStore((state) => state.removeAlert);

	return (
		<QueryClientProvider client={testQueryClient}>
			<BrowserRouter>
				{children}
				<AlertStack alerts={alerts} removeAlert={removeAlert} />
			</BrowserRouter>
		</QueryClientProvider>
	);
}
