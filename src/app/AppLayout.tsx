// import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
// import { Outlet } from "react-router-dom";

export default function AppLayout() {
	return (
		<div className="app-layout">
			<Sidebar />

			{/* <div className="main-layout">
				<Header />

				<main className="content">
					<Outlet />
				</main>
			</div> */}
		</div>
	)
}