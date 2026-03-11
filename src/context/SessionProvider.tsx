import { SessionContext } from "./useSession";
import { getSessionID, setSessionID } from "./sessionStore";

export function SessionProvider({children}: {children: React.ReactNode}) {
	return (
		<SessionContext.Provider value={{ sessionID: getSessionID(), setSessionID }}>
			{children}
		</SessionContext.Provider>
	)
}
