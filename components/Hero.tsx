"use client";

import { motion } from "motion/react";
import { Calendar, MessageCircle, ChevronRight } from "lucide-react";

type HeroData = {
  headline1: string;
  headline2: string;
  subtext: string;
  imageUrl: string;
  imageAlt: string;
};

type ContactData = {
  lineUrl: string;
  reservationFormUrl: string;
};

type Props = {
  hero: HeroData;
  contact: ContactData;
};

export default function Hero({ hero, contact }: Props) {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.imageUrl}
          alt={hero.imageAlt}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent md:to-white/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h2 className="text-[#5A6B5D] font-serif font-medium text-lg md:text-xl mb-4 tracking-widest">
            心と身体の調和を取り戻す
          </h2>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#2C3E30]">
            {hero.headline1}
            <br />
            <span className="text-[#C89F7D]">{hero.headline2}</span>
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed max-w-lg whitespace-pre-line">
            {hero.subtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={contact.reservationFormUrl}
              className="bg-[#5A6B5D] text-white px-8 py-4 rounded-full text-center font-bold hover:bg-[#4A5A4D] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <Calendar size={20} />
              WEB予約はこちら
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href={contact.lineUrl}
              className="bg-[#00B900] text-white px-8 py-4 rounded-full text-center font-bold hover:bg-[#00A000] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={20} />
              LINEで予約・相談
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
