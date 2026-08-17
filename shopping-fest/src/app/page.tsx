import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ThankYou } from "@/components/ThankYou";
import { NextEdition } from "@/components/NextEdition";
import { Shoppings } from "@/components/Shoppings";
import { PoweredByCasc } from "@/components/PoweredByCasc";
import { InstagramSection } from "@/components/InstagramSection";
import { Footer } from "@/components/Footer";
import { LegalBar } from "@/components/LegalBar";
import { ScrollReveal } from "@/components/ScrollReveal";

/* Section order matches the original page top to bottom. */
export default function Home() {
  return (
    <>
      <ScrollReveal />
      <AnnouncementBar />
      <Hero />
      <About />
      <ThankYou />
      <NextEdition />
      <Shoppings />
      <PoweredByCasc />
      <InstagramSection />
      <Footer />
      <LegalBar />
    </>
  );
}
