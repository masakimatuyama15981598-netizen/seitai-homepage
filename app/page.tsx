import siteData from "@/content/site.json";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ConceptSection from "@/components/ConceptSection";
import MenuSection from "@/components/MenuSection";
import DirectorSection from "@/components/DirectorSection";
import AccessSection from "@/components/AccessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#333333]">
      <Header clinic={siteData.clinic} contact={siteData.contact} />

      <main>
        <Hero hero={siteData.hero} contact={siteData.contact} />
        <ConceptSection concept={siteData.concept} />
        <MenuSection menu={siteData.menu} />
        <DirectorSection director={siteData.director} />
        <AccessSection access={siteData.access} clinic={siteData.clinic} />
        <ContactSection contact={siteData.contact} />
      </main>

      <Footer
        clinic={siteData.clinic}
        access={siteData.access}
        contact={siteData.contact}
      />
    </div>
  );
}
