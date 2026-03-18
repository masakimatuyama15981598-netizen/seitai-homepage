"use client";

import { motion } from "motion/react";

type DirectorData = {
  sectionTitle: string;
  headingLine1: string;
  headingLine2: string;
  name: string;
  title: string;
  qualifications: string;
  message: string[];
  imageUrl: string;
  imageAlt: string;
};

export default function DirectorSection({
  director,
}: {
  director: DirectorData;
}) {
  return (
    <section id="director" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4C5B9] rounded-tl-[100px] rounded-br-[100px] transform translate-x-4 translate-y-4" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={director.imageUrl}
                alt={director.imageAlt}
                className="relative z-10 w-full aspect-[4/5] object-cover rounded-tl-[100px] rounded-br-[100px] shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <span className="text-[#C89F7D] font-serif tracking-widest text-sm font-bold uppercase">
              Message
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-8 text-[#333]">
              {director.headingLine1}
              <br />
              {director.headingLine2}
            </h2>

            <div className="space-y-6 text-gray-700 leading-loose">
              {director.message.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="font-serif text-xl font-bold text-[#333]">
                {director.title}　{director.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {director.qualifications}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
