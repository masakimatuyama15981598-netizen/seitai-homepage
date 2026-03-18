"use client";

import { motion } from "motion/react";

type ConceptItem = {
  title: string;
  description: string;
  imageUrl: string;
};

type ConceptData = {
  sectionTitle: string;
  items: ConceptItem[];
};

export default function ConceptSection({ concept }: { concept: ConceptData }) {
  return (
    <section id="concept" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C89F7D] font-serif tracking-widest text-sm font-bold uppercase">
            Concept
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 text-[#333]">
            {concept.sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[#5A6B5D] mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {concept.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#333]">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
