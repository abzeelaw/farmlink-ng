import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In production, this should POST to a support endpoint or ticketing system.
    // For now we show a user-friendly confirmation.
    alert("Thanks for your message. We'll get back to you within 48 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="container-width">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Contact</h1>

          <p className="mt-3 text-slate-600">
            Have a question or need help? Send us a message and we'll respond as
            soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none" />
            </div>

            <div className="text-right">
              <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
