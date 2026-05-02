import Header from "@/components/layout/header/Header";
import { Outlet } from "react-router-dom";
import "./AppLayout.scss"
import AdSlot from "@/components/layout/ads/AdSlot";
import { AlertStack } from "@/components/alert/AlertStack";
import { useAlertStore } from "@/store/useAlertStore";
import { AuthInitializer } from "@/components/AuthInitializer";

export default function AppLayout() {
	const alerts = useAlertStore((state) => state.alerts);
	const removeAlert = useAlertStore((state) => state.removeAlert);

	return (
		<div className="app-layout">
			<AuthInitializer />
			<Header />

			<div className="main-layout">
				<main className="content">
					<div className="content-spacer"></div>
					<Outlet />

					<AdSlot />
				</main>
			</div>

			<div className="mobile-footer-ad">
				<AdSlot />
			</div>

			<AlertStack
				alerts={alerts}
				removeAlert={removeAlert}
			/>
		</div>
	)
}