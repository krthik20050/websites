import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-16 text-center">
      <div className="text-5xl">🖼️</div>
      <h1 className="text-2xl font-bold mt-4 text-zinc-900 dark:text-zinc-100">Page not found</h1>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-2">This link doesn’t exist - but nothing here is a dead end.</p>
      <div className="flex gap-3 justify-center mt-6">
        <Link href="/" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-6 py-2.5 text-sm font-bold">Go home</Link>
        <Link href="/collections/tamil-cinema" className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800">Browse Tamil Cinema</Link>
        <Link href="/collections" className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800">All collections</Link>
      </div>
    </div>
  );
}
