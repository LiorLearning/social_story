import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PilotMeter from "@/components/PilotMeter";
import ControlsRow from "@/components/ControlsRow";
import StoryGrid from "@/components/StoryGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen paper">
      <Header />
      <main>
        <Hero />
        <PilotMeter />
        <ControlsRow />
        <StoryGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
