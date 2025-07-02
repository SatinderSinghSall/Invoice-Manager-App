"use client";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 py-4 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <p className="text-white text-sm font-light">
          © {year} Satinder Invoice Manager App. All rights reserved.
        </p>
        <p className="text-blue-300 text-xs mt-2 md:mt-0">
          Built with ❤️ by Satinder Singh Sall
        </p>
      </div>
    </footer>
  );
}
