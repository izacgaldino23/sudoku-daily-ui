import type { AlertItem } from "@/types/AlertTypes";
import { X, Info, CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";

import "./Alert.scss";

interface Props {
	alert: AlertItem;
	onClose: (id: string) => void;
}

const iconMap = {
	neutral: Shield,
	info: Info,
	success: CheckCircle,
	warning: AlertTriangle,
	error: XCircle
};

export function Alert({ alert, onClose }: Props) {
	const Icon = iconMap[alert.variant];

	return (
		<div className={`alert alert--${alert.variant}`}>
			<div className="alert__icon">
				<Icon size={18} />
			</div>

			<div className="alert__content">
				{alert.message}
			</div>

			<button
				className="alert__close"
				onClick={() => onClose(alert.id)}
			>
				<X size={18} />
			</button>
		</div>
	);
}