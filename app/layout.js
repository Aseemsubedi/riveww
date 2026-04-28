import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Riveww — Smart Google Reviews",
  description: "Riveww helps Indian businesses manage and improve Google reviews with AI-powered workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
              Riveww
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Riveww. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded px-2 py-1 transition hover:bg-zinc-100">
                Home
              </Link>
              <Link
                href="/dashboard"
                className="rounded px-2 py-1 transition hover:bg-zinc-100"
              >
                Dashboard
              </Link>
              <Link href="/login" className="rounded px-2 py-1 transition hover:bg-zinc-100">
                Login
              </Link>
              <Link href="/faq" className="rounded px-2 py-1 transition hover:bg-zinc-100">
                FAQ
              </Link>
              <Link href="/terms" className="rounded px-2 py-1 transition hover:bg-zinc-100">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
