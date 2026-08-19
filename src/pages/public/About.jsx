import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="container-width">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">About FarmLink NG</h1>

          <p className="mt-4 text-slate-600">
            FarmLink NG is a B2C marketplace focused on empowering smallholder
            farmers across Nigeria by providing a reliable channel to reach
            customers, manage inventory, and receive prompt payments. We
            prioritize transparency, fair pricing, and quality control so
            consumers can trust the produce they order.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Our Mission</h2>

          <p className="mt-2 text-slate-600">
            To increase agricultural incomes and reduce food waste by making
            local produce accessible to urban buyers through a dependable and
            efficient marketplace.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">Core Principles</h2>

          <ul className="mt-3 space-y-3 text-slate-600">
            <li>
              <strong>Fair Pricing:</strong> Farmers set transparent prices,
              and platform fees are clearly communicated.
            </li>
            <li>
              <strong>Quality & Traceability:</strong> We encourage clear
              product descriptions and imagery so buyers know what they're
              purchasing.
            </li>
            <li>
              <strong>Reliable Delivery:</strong> We work with local partners to
              ensure produce reaches buyers promptly.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-slate-900">How It Works</h2>

          <ol className="mt-2 list-inside list-decimal space-y-2 text-slate-600">
            <li>Farmers list available products with photos, price and stock.</li>
            <li>Buyers place orders and complete secure payment at checkout.</li>
            <li>Orders are split per farmer; each farmer fulfills and marks status.</li>
            <li>We coordinate delivery and update buyers with order progress.</li>
          </ol>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Interested in selling on FarmLink NG?</p>

            <Link to="/auth" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
              Create a Seller Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
