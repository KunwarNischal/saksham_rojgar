"use client";

import Link from "next/link";

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
    <footer className="bg-slate-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Saksham<span className="text-blue-400">Rojgar</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <span className="text-white text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-3">
              {footerLinks.forJobSeekers.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-3">
              {footerLinks.forEmployers.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Saksham Rojgar. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">Made with ❤️ in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
