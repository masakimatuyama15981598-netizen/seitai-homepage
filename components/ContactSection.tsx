"use client";

import { MessageCircle, Calendar, ChevronRight } from "lucide-react";

type ContactData = {
  sectionTitle: string;
  subtext: string;
  lineUrl: string;
  reservationFormUrl: string;
};

export default function ContactSection({ contact }: { contact: ContactData }) {
  return (
    <section
      id="contact"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9F8F6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f0ede6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#333]">
            {contact.sectionTitle}
          </h2>
          <p className="mt-4 text-gray-600 whitespace-pre-line">
            {contact.subtext}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <a
            href={contact.lineUrl}
            className="bg-[#00B900] hover:bg-[#00A000] text-white p-8 rounded-2xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg group"
          >
            <MessageCircle size={48} className="mb-4" />
            <span className="font-bold text-xl mb-2">LINEで予約・相談</span>
            <span className="text-sm opacity-90 text-center">
              24時間受付中
              <br />
              スムーズなやり取りが可能です
            </span>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-full group-hover:bg-white/30 transition-colors">
              友だち追加する <ChevronRight size={16} />
            </div>
          </a>

          <a
            href={contact.reservationFormUrl}
            className="bg-[#5A6B5D] hover:bg-[#4A5A4D] text-white p-8 rounded-2xl flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg group"
          >
            <Calendar size={48} className="mb-4" />
            <span className="font-bold text-xl mb-2">WEBフォーム予約</span>
            <span className="text-sm opacity-90 text-center">
              24時間受付中
              <br />
              ご希望の日時を選択できます
            </span>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-full group-hover:bg-white/30 transition-colors">
              予約フォームへ <ChevronRight size={16} />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
