const SectionTitle = ({
  title,
  subtitle,
  center = false,
}) => {
  return (
    <div
      className={`mb-12 ${
        center ? "text-center" : ""
      }`}
    >
      <h2 className="text-4xl font-bold">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;