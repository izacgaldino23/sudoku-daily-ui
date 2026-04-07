import { NavLink, useLocation } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";

export default function Header() {
	const location = useLocation();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");
	const authState = useAuthStore.getState().state;

	const isLoggedIn = (authState && authState.username);

	return (
		<header className="header">
			<Logo />

			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>

			<NavLink to={isLoggedIn ? "/profile" : "/login"}  className="profile-icon">
				{/* <img src={defaultAvatar} alt="avatar" /> */}
				<User />
			</NavLink>
			{/* {isPlayActive && (
				<nav>
					<NavLink to="/">4x4</NavLink>
					<NavLink to="/play/medium">6x6</NavLink>
					<NavLink to="/play/hard">9x9</NavLink>
				</nav>
			)} */}
		</header>
	)
}