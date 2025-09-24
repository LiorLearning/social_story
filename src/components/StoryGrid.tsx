import StoryCard from "./StoryCard";
import { stories } from "@/data/stories";

const StoryGrid = () => {
  return (
    <div className="container-responsive py-6 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;