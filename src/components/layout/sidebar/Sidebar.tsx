import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.scss"
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar() {
	const location = useLocation();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");
	const authState = useAuthStore.getState().state;

	return (
		<aside className="sidebar">
			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/about">About</NavLink>
				{(authState && authState.username) ? (
					<NavLink to="/profile">Me</NavLink>
				) : (
					<NavLink to="/login">Login</NavLink>
				)}
			</nav>
		</aside>
	)
}