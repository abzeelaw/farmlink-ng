const AuthInput = ({
  label,
  type = "text",
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;