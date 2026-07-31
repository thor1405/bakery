"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Menu", href: "/#menu" },
    { name: "Cakes", href: "/collection" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-6 text-white"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-serif font-bold tracking-wider ${
            isScrolled || !isHome ? "text-gray-900" : "text-white"
          }`}
        >
          CREAM CARAMEL
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm tracking-wide uppercase transition-colors font-medium hover:text-[#9c6f44] ${
                isScrolled || !isHome ? "text-gray-600" : "text-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons & Mobile Toggle */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <CartDrawer isDarkText={isScrolled || !isHome} />
          
          <button
            className={`md:hidden ${isScrolled || !isHome ? "text-gray-900" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl absolute w-full top-full left-0"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg text-gray-900 uppercase tracking-wider font-medium hover:text-[#a58641] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 w-full my-4"></div>
              <Link
                href="/collection"
                className="w-full py-3 text-center bg-[#a58641] hover:bg-[#8b6f33] transition-colors text-white uppercase tracking-wider shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Order Online
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
