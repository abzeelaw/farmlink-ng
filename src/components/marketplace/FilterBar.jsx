const FilterBar = () => {
  return (
    <div className="container-width mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow">
        <select className="rounded-xl border border-slate-300 px-4 py-3">
          <option>All States</option>
          <option>Kaduna</option>
          <option>Kano</option>
          <option>Benue</option>
          <option>Plateau</option>
          <option>Ogun</option>
        </select>

        <select className="rounded-xl border border-slate-300 px-4 py-3">
          <option>Sort By</option>
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