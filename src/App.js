// App.jsx
import { AnimatePresence } from "framer-motion";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <AnimatePresence mode="wait">
      <HeroSection />
    </AnimatePresence>
  );
}

export default App;