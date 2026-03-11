import { SessionContext } from "./SessionContext";
import { getSessionID, setSessionID } from "./sessionStorage";

export function SessionProvider({children}: {children: React.ReactNode}) {
	return (
		<SessionContext.Provider value={{ sessionID: getSessionID(), setSessionID }}>
			{children}
		</SessionContext.Provider>
	)
}
