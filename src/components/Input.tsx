import { forwardRef, type ReactNode } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean;
  error?: string | ReactNode;
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div>
        {props.label && (
          <label className="text-sm text-white">{props.label}</label>
        )}

        <input
          ref={ref}
          className={`w-full rounded-md bg-white/10 p-4 text-white ${
            props.disabled ? "bg-gray-500" : ""
          } ${props.error ? "border-2 border-red-500" : ""} ${className ?? ""}`}
          {...props}
        />

        {props.error && (
          <div className="text-sm text-red-500">{props.error}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
