import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Sidebar() {
	return (
		<aside>
			<Logo />
			
			<nav>
				<NavLink to="/">Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/profile">Profile</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>
		</aside>
	)
}