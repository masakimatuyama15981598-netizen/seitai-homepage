"use client";

import { MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";

type ClinicData = {
  name: string;
  logoChar: string;
  description: string;
};

type AccessData = {
  postalCode: string;
  address: string;
  phone: string;
  hours: string;
  closedDays: string;
};

type ContactData = {
  lineUrl: string;
  instagramUrl: string;
};

type Props = {
  clinic: ClinicData;
  access: AccessData;
  contact: ContactData;
};

const NAV_ITEMS = [
  { label: "当院について", id: "concept" },
  { label: "施術メニュー・料金", id: "menu" },
  { label: "院長挨拶", id: "director" },
  { label: "アクセス・店舗情報", id: "access" },
  { label: "ご予約・お問い合わせ", id: "contact" },
];

export default function Footer({ clinic, access, contact }: Props) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#2C3E30] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2C3E30] font-serif font-bold text-2xl">
                {clinic.logoChar}
              </div>
              <span className="font-serif font-bold text-2xl tracking-widest">
                {clinic.name}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {clinic.description}
            </p>
            <div className="flex gap-4">
              <a
                href={contact.lineUrl}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00B900] transition-colors"
                aria-label="LINE"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href={contact.instagramUrl}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">
              Menu
            </h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">
              Info
            </h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 mt-1" size={18} />
                <span>
                  {access.postalCode}
                  <br />
                  {access.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0" size={18} />
                <a
                  href={`tel:${access.phone.replace(/-/g, "")}`}
                  className="text-xl font-bold tracking-wider hover:text-white transition-colors"
                >
                  {access.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="shrink-0 mt-1" size={18} />
                <span>
                  {access.hours}
                  <br />
                  定休日：{access.closedDays}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {clinic.name} All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
