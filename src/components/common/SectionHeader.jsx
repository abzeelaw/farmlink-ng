const SectionHeader = ({
  badge,
  title,
  subtitle,
}) => {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
        {badge}
      </span>

      <h2 className="mt-5 text-4xl font-bold">
        {title}
      </h2>

      <p className="mt-4 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;