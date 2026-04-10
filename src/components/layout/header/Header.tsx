import { NavLink, useLocation } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";

export default function Header() {
	const location = useLocation();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");
	const authState = useAuthStore(s => s.state);

	const isLoggedIn = (authState && authState.username);

	return (
		<header className="header">
			<Logo />

			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>

			<NavLink to={isLoggedIn ? "/profile" : "/login"}  className="profile-link">
				{isLoggedIn && (<h3>{authState.username}</h3>)}
				<User className="profile-icon"/>
			</NavLink>
		</header>
	)
}