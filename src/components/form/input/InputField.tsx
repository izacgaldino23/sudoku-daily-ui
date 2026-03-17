import { InputFieldType, type InputFieldProps } from "@/types/ui";
import "./InputField.scss"
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export function InputField({ id, label, type, value, placeholder, disabled, onChange, required, ref }: InputFieldProps) {
	const isPassword = type === InputFieldType.PASSWORD;
	const [ showPassword, setShowPassword ] = useState<boolean>(false)

	const requiredSuffix = required ? " *" : "";
	const labelName = label + requiredSuffix

	return (
		<div className="input-field">
			{label && (
				<label htmlFor={id}>
					{labelName}
					{isPassword && (
						<span>
							{showPassword ? (
								<Eye onClick={() => setShowPassword(false)} />
							) : (
								<EyeClosed onClick={() => setShowPassword(true)} />
							)}
						</span>
					)}
				</label>
			)}

			<input ref={ref} id={id} type={isPassword && showPassword ? "text" : type} value={value} placeholder={placeholder} disabled={disabled} onChange={onChange} required={required} />
		</div>
	)
}