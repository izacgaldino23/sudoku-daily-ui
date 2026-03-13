import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionStore {
	sessionID: string | null;
	setSessionID: (id: string | null) => void;
}

export const useSessionStore = create<SessionStore>()(
	persist(
		(set) => ({
			sessionID: null,
			setSessionID: (id: string | null) => set({ sessionID: id }),
		}),
		{
			name: "session-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)

