"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("maternalguard_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Listen for storage changes (sign-in from another component)
    const onStorage = () => {
      const s = sessionStorage.getItem("maternalguard_user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]); // re-check on route change

  const handleSignOut = () => {
    sessionStorage.removeItem("maternalguard_user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Maternal<span className="text-teal-600">Guard</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-teal-600" : "text-gray-600 hover:text-teal-600"
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/assess"
                  className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  New Assessment
                </Link>
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-1">
                  <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
