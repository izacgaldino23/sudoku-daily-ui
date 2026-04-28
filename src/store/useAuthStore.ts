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
	justLoggedIn: boolean
	setJustLoggedIn: (value: boolean) => void
	lastRefreshedAt: number | null
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			state: null,
			justLoggedIn: false,
			lastRefreshedAt: null,

			login: (data: AuthData) => set({ state: data, lastRefreshedAt: Date.now() }),
			updateAccessToken: (accessToken) => 
				set((prev) => ({
					state: prev.state 
						? { ...prev.state, accessToken }
						: null,
					lastRefreshedAt: Date.now()
				})),
			setJustLoggedIn: (value: boolean) => set({ justLoggedIn: value }),
			logout: () => {
				set({ state: null, justLoggedIn: false, lastRefreshedAt: null });
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
			partialize: (state) => ({ state: state.state, lastRefreshedAt: state.lastRefreshedAt }),
		}
	)
)