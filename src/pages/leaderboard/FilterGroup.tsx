import Button from "@/components/form/button/Button";
import { memo } from "react";

interface FilterOption {
	value: string;
	label: string;
}

interface FilterGroupProps {
	label: string;
	options: FilterOption[];
	value: string;
	onChange: (value: string) => void;
}

export const FilterGroup = memo(function FilterGroup({ label, options, value, onChange }: FilterGroupProps) {
	return (
		<div className="filter_group">
			<label>{label}:</label>
			<div className="filter_buttons">
				{options.map((opt) => (
					<Button
						key={opt.value}
						text={opt.label}
						className={value === opt.value ? "active" : ""}
						onClick={() => onChange(opt.value)}
					/>
				))}
			</div>
		</div>
	);
});