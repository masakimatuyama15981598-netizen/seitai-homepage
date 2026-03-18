"use client";

import { MapPin, Phone, Clock } from "lucide-react";

type AccessData = {
  sectionTitle: string;
  postalCode: string;
  address: string;
  nearestStation: string;
  phone: string;
  hours: string;
  closedDays: string;
  parkingNote: string;
  googleMapsEmbedUrl: string;
};

type ClinicData = {
  name: string;
  logoChar: string;
};

type Props = {
  access: AccessData;
  clinic: ClinicData;
};

export default function AccessSection({ access, clinic }: Props) {
  return (
    <section id="access" className="py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C89F7D] font-serif tracking-widest text-sm font-bold uppercase">
            Access
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 text-[#333]">
            {access.sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[#5A6B5D] mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 bg-white p-6 md:p-12 rounded-3xl shadow-sm">
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#333] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5A6B5D] flex items-center justify-center text-white text-sm">
                  {clinic.logoChar}
                </div>
                {clinic.name}
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <MapPin
                    className="text-[#C89F7D] shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p>{access.postalCode}</p>
                    <p>{access.address}</p>
                    {access.nearestStation && (
                      <p className="text-sm text-gray-500 mt-1">
                        ※{access.nearestStation}
                      </p>
                    )}
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-[#C89F7D] shrink-0" size={20} />
                  <a
                    href={`tel:${access.phone.replace(/-/g, "")}`}
                    className="font-bold text-lg tracking-wider hover:text-[#5A6B5D] transition-colors"
                  >
                    {access.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock
                    className="text-[#C89F7D] shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p>営業時間：{access.hours}</p>
                    <p>定休日：{access.closedDays}</p>
                  </div>
                </li>
              </ul>
            </div>

            {access.parkingNote && (
              <div className="bg-[#F9F8F6] p-6 rounded-xl">
                <h4 className="font-bold text-[#333] mb-3">駐車場について</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {access.parkingNote}
                </p>
              </div>
            )}
          </div>

          <div className="h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden">
            {access.googleMapsEmbedUrl ? (
              <iframe
                src={access.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 p-6 text-center rounded-2xl">
                <MapPin size={48} className="mb-4 text-gray-400" />
                <p className="font-bold mb-2">Googleマップ 埋め込みスペース</p>
                <p className="text-sm">
                  site.json の{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    access.googleMapsEmbedUrl
                  </code>{" "}
                  にGoogle Mapsのiframe src URLを設定してください。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
