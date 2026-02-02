"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    forJobSeekers: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Career Advice", href: "/" },
      { label: "Resume Tips", href: "/" },
      { label: "Job Alerts", href: "/" },
    ],
    forEmployers: [
      { label: "Post a Job", href: "/register" },
      { label: "Browse Candidates", href: "/" },
      { label: "Pricing", href: "/" },
      { label: "Recruitment Solutions", href: "/" },
    ],
    company: [
      { label: "About Us", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Blog", href: "/" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  };

  const socialLinks = [
    { label: "Twitter", icon: "𝕏", href: "#" },
    { label: "LinkedIn", icon: "in", href: "#" },
    { label: "Facebook", icon: "f", href: "#" },
    { label: "Instagram", icon: "📷", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-4 sm:mb-0">
            <Link href="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <Image 
                src="/logo.png" 
                alt="Saksham Rojgar" 
                width={40} 
                height={40}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Saksham<span className="text-blue-400">Rojgar</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
            {/* Social Links */}
            <div className="flex space-x-2 sm:space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <span className="text-white text-xs sm:text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">For Job Seekers</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.forJobSeekers.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">For Employers</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.forEmployers.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} Saksham Rojgar. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span className="text-xs sm:text-sm text-gray-500">Made with ❤️ in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
