import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    navigate('/create');
  };

  return (
    <section className="hero-bg py-12 sm:py-16 md:py-20">
      <div className="relative z-10 container-responsive text-center">
        <h1 className="text-headline mb-6 sm:mb-8">
          Make a world.
          <br />
          Share the magic.
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
          <Button 
            size="lg"
            className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus-ring tap-target w-full sm:w-auto"
            onClick={handleCreateStory}
          >
            Create a Story
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="h-12 px-6 rounded-2xl border-white/30 text-ink hover:bg-white/10 focus-ring tap-target w-full sm:w-auto"
          >
            Browse
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;