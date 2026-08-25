"use client";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 lg:py-8 w-full">
      <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Contact</h1>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">We’d love to hear from you. Fan art for fans - reach us anytime.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Reach us</h2>
          <div className="text-sm leading-relaxed mt-3 space-y-2 text-zinc-900 dark:text-zinc-100">
            <div>📧 Email: <a href="mailto:posterdrip.in@gmail.com" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">posterdrip.in@gmail.com</a></div>
            <div>💬 WhatsApp: <a href="https://wa.me/919493344060" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">+91 94933 44060</a></div>
            <div>📍 India - shipping across India</div>
            <div>📸 Instagram: <a href="https://www.instagram.com/posterdrip.in/?hl=en" target="_blank" rel="noreferrer" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">posterdrip.in</a></div>
          </div>
          <div className="mt-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">Free Shipping on Prepaid Orders Above ₹250 • No exchange / No return (as per original store)</div>
        </div>

        <form className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-900 space-y-3" onSubmit={e => { e.preventDefault(); alert("Demo - message not sent. Wire to server action in production."); }}>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Send a message (demo)</h2>
          <input placeholder="Name" maxLength={100} required className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
          <input type="email" placeholder="Email" maxLength={254} required className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
          <textarea placeholder="Message" maxLength={2000} required rows={4} className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
          {/* honeypot */}
          <input type="text" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 rounded-full py-2.5 text-sm font-bold">Send (demo - no email sent)</button>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Demo form - wire to server action / Resend / Shopify contact API for production. Honeypot + length limits already enforced.</p>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link href="/collections/tamil-cinema" className="inline-flex bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-6 py-2.5 text-sm font-bold">Shop Tamil Cinema</Link>
      </div>
    </div>
  );
}
