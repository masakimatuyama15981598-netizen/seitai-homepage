"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type ClinicData = {
  name: string;
  logoChar: string;
};

type ContactData = {
  lineUrl: string;
  reservationFormUrl: string;
};

type Props = {
  clinic: ClinicData;
  contact: ContactData;
};

const NAV_ITEMS = [
  { label: "当院について", id: "concept" },
  { label: "施術メニュー", id: "menu" },
  { label: "院長挨拶", id: "director" },
  { label: "アクセス", id: "access" },
];

export default function Header({ clinic, contact }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top =
        el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 rounded-full bg-[#5A6B5D] flex items-center justify-center text-white font-serif font-bold text-xl">
              {clinic.logoChar}
            </div>
            <span className="font-serif font-bold text-xl tracking-widest text-[#333]">
              {clinic.name}
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium hover:text-[#5A6B5D] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-4">
              <a
                href={contact.lineUrl}
                className="bg-[#00B900] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-[#00A000] transition-colors shadow-sm"
              >
                <MessageCircle size={16} />
                LINE予約
              </a>
              <a
                href={contact.reservationFormUrl}
                className="bg-[#5A6B5D] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#4A5A4D] transition-colors shadow-sm"
              >
                WEB予約
              </a>
            </div>
          </nav>

          <button
            className="md:hidden p-2 text-[#333]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニューを開く"
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-6 flex flex-col"
          >
            <div className="flex flex-col gap-6 text-lg font-serif text-center">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="py-2 border-b border-gray-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <a
                href={contact.lineUrl}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#00B900] text-white py-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle size={20} />
                LINEで予約・相談する
              </a>
              <a
                href={contact.reservationFormUrl}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#5A6B5D] text-white py-4 rounded-xl text-center font-bold shadow-md"
              >
                WEBから予約する
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
