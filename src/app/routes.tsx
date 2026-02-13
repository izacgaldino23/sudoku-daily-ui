import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Play from "@/pages/Play";
import Leaderboard from "@/pages/Leaderboard";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import About from "@/pages/About";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <Play />
			},
			{
				path: "/leaderboard",
				element: <Leaderboard />
			},
			{
				path: "/login",
				element: <Login />
			},
			{
				path: "/profile",
				element: <Profile />
			},
			{
				path: "/about",
				element: <About />
			},
		]
	},
])