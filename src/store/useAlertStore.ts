import { create } from 'zustand';
import type { AlertItem, AlertVariant } from "@/types/AlertTypes";

interface AlertStore {
	alerts: AlertItem[];
	pushAlert: (message: string, variant?: AlertVariant) => void;
	removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
	alerts: [],

	removeAlert: (id) =>
		set((state) => ({
			alerts: state.alerts.filter((a) => a.id !== id)
		})),

	pushAlert: (message, variant = "info") => {
		const id = crypto.randomUUID();
		const newAlert: AlertItem = { id, message, variant };

		set((state) => ({
			alerts: [...state.alerts, newAlert]
		}));

		setTimeout(() => {
			useAlertStore.getState().removeAlert(id);
		}, 5000);
	},
}));