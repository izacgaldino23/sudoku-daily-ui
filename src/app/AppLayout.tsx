import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AppLayout.scss"
import AdSlot from "@/components/layout/ads/AdSlot";
import { AlertStack } from "@/components/alert/AlertStack";
import { useAlertStore } from "@/store/useAlertStore";

export default function AppLayout() {
	const alerts = useAlertStore((state) => state.alerts);
	const removeAlert = useAlertStore((state) => state.removeAlert);

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

			<AlertStack 
				alerts={alerts}
				removeAlert={removeAlert}
			/>
		</div>
	)
}