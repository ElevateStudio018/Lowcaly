import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FlavorScroll } from "./components/FlavorScroll";
import { Comparison } from "./components/Comparison";
import { ContentStrip } from "./components/ContentStrip";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-cream text-forest">
      <Header />
      <main>
        <Hero />
        <FlavorScroll />
        <Comparison />
        <ContentStrip />
      </main>
      <Footer />
    </div>
  );
}
