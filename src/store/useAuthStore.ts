import { type AuthData } from "@/types/auth"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface AuthStore {
	state: AuthData
	login: (data: AuthData) => void
	updateToken: (data: AuthData) => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			state: {} as AuthData,
			login: (data: AuthData) => set({ state: data }),
			updateToken: (data: AuthData) => set({ state: data }),
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)