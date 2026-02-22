"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

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
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-teal-600" : "text-gray-600 hover:text-teal-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/assess"
              className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              New Assessment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
