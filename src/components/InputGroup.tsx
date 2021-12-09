import { ReactElement } from "react";
import RequiredStar from "./RequiredStar";

interface InputGroupProps {
  className?: string;
  type: string;
  labelText?: string;
  placeholder?: string;
  name: string;
  value: string;
  error: string | undefined;
  label?: boolean;
  uppercase?: boolean;
  required?: boolean;
  step?: boolean;
  disabled?: boolean;
  icon?: string;
  min?: string | number;
  max?: string | number;
  hidden?: boolean;
  id?: string;
  inline?: ReactElement;
  setValue: (str: string) => void;
  changeEvent?: (str: string) => void;
  keyDownEvent?: () => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  type,
  name,
  labelText,
  placeholder,
  value,
  label,
  uppercase,
  disabled,
  required,
  icon,
  error,
  step,
  min,
  max,
  hidden,
  inline,
  id,
  setValue,
  changeEvent,
  keyDownEvent,
}) => {
  if (label === undefined) {
    label = true;
  }

  return (
    <>
      <div className={className} style={hidden ? { display: "none" } : {}}>
        {label ? (
          <label htmlFor={name}>
            {icon ? <i className={`${icon} mr-1`} /> : null}
            {labelText}
            {required ? <RequiredStar /> : null}
          </label>
        ) : null}
        <input
          id={id}
          name={name}
          required={!!required}
          disabled={!!disabled}
          type={type}
          className={error ? "form-control is-invalid" : "form-control"}
          value={value}
          step={step ? ".01" : null}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={(e) => {
            if (uppercase) {
              setValue(e.target.value.toUpperCase());
            } else {
              setValue(e.target.value);
            }

            if (changeEvent) {
              changeEvent(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && keyDownEvent) keyDownEvent();
          }}
        />
        {error ? <div className="invalid-feedback">{error}</div> : null}
        {inline || null}
      </div>
    </>
  );
};

export default InputGroup;
