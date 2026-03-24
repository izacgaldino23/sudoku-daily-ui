import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Leaderboard from "@/pages/leaderboard/Leaderboard";
import Login from "@/pages/login/Login";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import PlayWrapper from "@/pages/play/PlayWrapper";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <PlayWrapper />
			},
			{
				path: "/play/:size",
				element: <PlayWrapper />
			},
			{
				path: "/leaderboard",
				element: <Leaderboard />
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
	{
		path: "/login",
		element: <Login />
	}
])