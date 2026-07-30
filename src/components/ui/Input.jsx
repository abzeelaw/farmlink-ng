const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        className={`border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;