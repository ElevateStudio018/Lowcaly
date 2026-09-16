import { Header } from "./components/Header";
import { Cinematic } from "./components/Cinematic";
import { About } from "./components/About";
import { Ingredients } from "./components/Ingredients";
import { ProductGrid } from "./components/ProductGrid";
import { Comparison } from "./components/Comparison";
import { WhereToBuy } from "./components/WhereToBuy";
import { ContentStrip } from "./components/ContentStrip";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-cream text-forest">
      <Header />
      <main>
        <Cinematic />
        <About />
        <Ingredients />
        <ProductGrid />
        <Comparison />
        <WhereToBuy />
        <ContentStrip />
      </main>
      <Footer />
    </div>
  );
}
