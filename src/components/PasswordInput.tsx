import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  buttonClassName?: string;
}

const PasswordInput = ({
  buttonClassName = "",
  ...inputProps
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-input-wrapper">
      <input
        {...inputProps}
        type={visible ? "text" : "password"}
      />
      <button
        type="button"
        className={`password-visibility-button ${buttonClassName}`.trim()}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
  );
};

export default PasswordInput;
