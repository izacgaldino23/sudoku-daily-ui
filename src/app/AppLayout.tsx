import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AppLayout.scss"
import AdSlot from "@/components/layout/ads/AdSlot";

export default function AppLayout() {
	return (
		<div className="app-layout">
			<Header />

			<div className="main-layout">
				<Sidebar />

				<main className="content">
					<Outlet />

					<AdSlot />
				</main>
			</div>
		</div>
	)
}