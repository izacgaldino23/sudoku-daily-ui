import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AppLayout.scss"

export default function AppLayout() {
	return (
		<div className="app-layout">
			<Header />

			<div className="main-layout">
				<Sidebar />

				<main className="content">
					<Outlet />
				</main>
			</div>
		</div>
	)
}