import { type AuthData } from "@/types/api/auth"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface AuthStore {
	state: AuthData | null
	login: (data: AuthData) => void
	updateToken: (tokens: Pick<AuthData, "accessToken" | "refreshToken">) => void;
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			state: null,

			login: (data: AuthData) => set({ state: data }),
			updateToken: (tokens) => 
				set((prev) => ({
					state: prev.state 
						? { ...prev.state, ...tokens }
						: null
				})),
			logout: () => set({ state: null }),
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => state.state || {},
		}
	)
)