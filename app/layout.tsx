import type { Metadata } from "next";
import "./globals.css";
import siteData from "@/content/site.json";

export const metadata: Metadata = {
  title: siteData.clinic.name,
  description: siteData.clinic.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
