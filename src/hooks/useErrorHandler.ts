import { useAlertStore } from "@/store/useAlertStore";
import { getErrorMessage } from "@/types/errors";

export function useErrorHandler() {
	const pushAlert = useAlertStore(s => s.pushAlert);

	return (error: Error) => {
		pushAlert(getErrorMessage(error), "error");
	};
}