import { forwardRef } from "react";

const stylesMap = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-gray-600 hover:bg-gray-700",
};

type ButtonProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: keyof typeof stylesMap;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, ...props }, ref) => {
    let styles = stylesMap[variant ?? "primary"];

    if (loading || props.disabled) {
      styles = "bg-slate-700 cursor-not-allowed";
    }

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <button
        ref={ref}
        className={`rounded-md p-4 text-white ${styles} ${className ?? ""}`}
        disabled={loading}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
