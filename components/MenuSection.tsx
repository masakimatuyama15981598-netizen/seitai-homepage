"use client";

import { motion } from "motion/react";

type MenuItem = {
  name: string;
  duration: string;
  price: string;
  description: string;
  isRecommended: boolean;
};

type MenuData = {
  sectionTitle: string;
  initialFeeNote: string;
  items: MenuItem[];
};

export default function MenuSection({ menu }: { menu: MenuData }) {
  return (
    <section id="menu" className="py-24 bg-[#F9F8F6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C89F7D] font-serif tracking-widest text-sm font-bold uppercase">
            Menu &amp; Price
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 text-[#333]">
            {menu.sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[#5A6B5D] mx-auto mt-6" />
        </div>

        <div className="space-y-6">
          {menu.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm border-2 transition-colors ${
                item.isRecommended
                  ? "border-[#C89F7D]"
                  : "border-transparent hover:border-gray-100"
              }`}
            >
              {item.isRecommended && (
                <span className="bg-[#C89F7D] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  一番人気
                </span>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#333]">
                    {item.name}
                  </h3>
                  <span className="text-gray-500 text-sm mt-1 inline-block">
                    目安時間: {item.duration}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#5A6B5D]">
                    ¥{item.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">(税込)</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base border-t border-gray-100 pt-4">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">{menu.initialFeeNote}</p>
        </div>
      </div>
    </section>
  );
}
