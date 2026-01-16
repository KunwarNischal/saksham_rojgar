"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ userRole }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = {
    jobseeker: [
      { href: "/", label: "Home" },
      { href: "/jobseeker/browse", label: "Browse Jobs" },
      { href: "/jobseeker/dashboard", label: "Dashboard" },
      { href: "/jobseeker/profile", label: "Profile" },
    ],
    employer: [
      { href: "/", label: "Home" },
      { href: "/employer/dashboard", label: "Dashboard" },
      { href: "/employer/post-job", label: "Post Job" },
      { href: "/employer/manage-jobs", label: "Manage Jobs" },
    ],
    admin: [
      { href: "/", label: "Home" },
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/jobs", label: "All Jobs" },
    ],
    guest: [
      { href: "/", label: "Home" },
      { href: "/jobs", label: "Browse Jobs" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  };

  const links = navLinks[userRole] || navLinks.guest;

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Saksham Rojgar" 
              width={32} 
              height={32}
              className="object-contain md:w-10 md:h-10"
            />
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#45A28E] via-[#5D99C6] to-[#E67E22] bg-clip-text text-transparent">Saksham Rojgar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  pathname === link.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userRole && userRole !== "guest" && (
              <button
                onClick={logout}
                className="ml-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col space-y-2.5 pt-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    pathname === link.href
                      ? "text-blue-600 border-l-4 border-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {userRole && userRole !== "guest" && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-5 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
