import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.scss"

export default function Sidebar() {
	const location = useLocation();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");

	return (
		<aside className="sidebar">
			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/profile">Profile</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>
		</aside>
	)
}