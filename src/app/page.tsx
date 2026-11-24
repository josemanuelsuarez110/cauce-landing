import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Security } from "@/components/Security";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido" className="pt-16">
        <Hero />
        <Calculator />
        <Security />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
