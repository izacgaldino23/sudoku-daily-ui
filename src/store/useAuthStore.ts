import { useGameStore } from "./useGameStore"
import { useSessionStore } from "./useSessionStore"
import { type AuthData, type BoardSize } from "@/types/api/auth"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface AuthStore {
	state: AuthData | null
	login: (data: AuthData) => void
	updateAccessToken: (accessToken: string) => void;
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			state: null,

			login: (data: AuthData) => set({ state: data }),
			updateAccessToken: (accessToken) => 
				set((prev) => ({
					state: prev.state 
						? { ...prev.state, accessToken }
						: null
				})),
			logout: () => {
				set({ state: null });
				const sizes: BoardSize[] = [4, 6, 9];
				sizes.forEach((size) => {
					useGameStore.getState().removeGame(size)
				})
				useSessionStore.getState().setSessionID(null)
			},
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ state: state.state }),
		}
	)
)