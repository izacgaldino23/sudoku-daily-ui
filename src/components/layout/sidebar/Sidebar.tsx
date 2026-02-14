import { NavLink } from "react-router-dom";
import "./Sidebar.scss"

export default function Sidebar() {
	return (
		<aside className="sidebar">
			<nav>
				<NavLink to="/">Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/profile">Profile</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>
		</aside>
	)
}