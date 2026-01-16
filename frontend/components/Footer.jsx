"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Saksham Rojgar" 
              width={32} 
              height={32}
              className="object-contain"
            />
            <h3 className="text-lg font-bold bg-gradient-to-r from-[#45A28E] via-[#5D99C6] to-[#E67E22] bg-clip-text text-transparent">
              Saksham Rojgar
            </h3>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Saksham Rojgar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
