const FilterBar = ({ selectedState, setSelectedState, sortBy, setSortBy }) => {
  const states = ["All States", "Kaduna", "Kano", "Benue", "Plateau", "Ogun"];

  return (
    <div className="container-width mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option>Newest</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
          <option>Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;