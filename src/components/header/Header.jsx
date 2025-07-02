"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-2xl font-extrabold tracking-tight"
        >
          Invoice<span className="text-blue-300">Manager</span>
          <span className="ml-1 text-xl text-blue-400 font-medium">App</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-white bg-blue-700 hover:bg-blue-600 hover:text-black px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            📊 My Dashboard
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block text-white bg-blue-700 hover:bg-blue-600 hover:text-black px-4 py-2 rounded-lg transition-all duration-200"
              >
                Satinder - Invoice Manager
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
