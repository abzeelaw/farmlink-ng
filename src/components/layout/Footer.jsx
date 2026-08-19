import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white py-12">
      <div className="container-width">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-emerald-700">FarmLink NG</h3>
            <p className="mt-2 text-sm text-slate-600">
              Connecting smallholder farmers to buyers across Nigeria — fresh,
              fairly priced, and delivered with care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:underline">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">Contact</h4>
            <p className="mt-3 text-sm text-slate-600">support@farmlink.ng</p>
            <p className="mt-1 text-sm text-slate-600">+234 800 000 0000</p>
            <p className="mt-1 text-sm text-slate-600">Lagos, Nigeria</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FarmLink NG. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;