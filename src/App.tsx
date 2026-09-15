import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

// Startmall: allt textinnehåll (namn, texter, kontaktuppgifter) är
// platshållare avsedda att bytas ut mot riktigt innehåll för er verksamhet.
export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
