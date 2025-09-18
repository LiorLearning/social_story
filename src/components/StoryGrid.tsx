import StoryCard from "./StoryCard";
import { stories } from "@/data/stories";

const StoryGrid = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-10 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;