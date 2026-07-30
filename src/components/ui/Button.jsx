import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25",

    secondary:
      "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25",

    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",

    ghost:
      "hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "px-4 py-2",

    md: "px-6 py-3",

    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {leftIcon}

      {children}

      {rightIcon}
    </button>
  );
};

export default Button;