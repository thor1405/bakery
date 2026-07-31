"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Menu", href: "#menu" },
    { name: "Cakes", href: "#cakes" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "glass py-4 shadow-sm"
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
            isScrolled ? "text-[var(--foreground)]" : "text-white"
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
              className={`text-sm tracking-wide uppercase transition-colors hover:text-[var(--primary)] ${
                isScrolled ? "text-[var(--foreground)]" : "text-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons / CTAs */}
        <div className="hidden md:flex items-center space-x-6">
          <CartDrawer isScrolled={isScrolled} />
          <Link
            href="#order"
            className="px-6 py-2 bg-[var(--primary)] text-white text-sm uppercase tracking-wider hover:bg-[#724a23] transition-colors rounded-sm"
          >
            Order Online
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden ${isScrolled ? "text-[var(--foreground)]" : "text-white"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[rgba(0,0,0,0.1)] absolute w-full top-full left-0"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg text-[var(--foreground)] uppercase tracking-wider font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-[var(--border)] w-full my-4"></div>
              <Link
                href="#order"
                className="w-full py-3 text-center bg-[var(--primary)] text-white uppercase tracking-wider"
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
