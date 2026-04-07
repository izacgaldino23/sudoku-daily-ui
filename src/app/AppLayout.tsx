import Header from "@/components/layout/header/Header";
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