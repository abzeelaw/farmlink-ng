const Badge = ({
  children,
}) => {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-medium">
      {children}
    </span>
  );
};

export default Badge;