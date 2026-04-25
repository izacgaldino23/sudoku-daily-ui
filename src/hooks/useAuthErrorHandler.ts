import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/types/errors";
import { useAlertStore } from "@/store/useAlertStore";

export function useAuthErrorHandler() {
	const navigate = useNavigate();
	const logout = useAuthStore((s) => s.logout);
	const pushAlert = useAlertStore((s) => s.pushAlert);

	return (error: Error) => {
		if (error.name === "ApiError") {
			const apiError = error as unknown as { status?: number };
			if (apiError.status === 401) {
				pushAlert("Session expired. Please login again.", "warning");
				logout();
				navigate("/login", { replace: true });
				return;
			}
		}
		pushAlert(getErrorMessage(error), "error");
	};
}