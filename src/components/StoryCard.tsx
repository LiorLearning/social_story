import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatNumber";
import { Story } from "@/data/stories";
import CommentsModal from "./CommentsModal";

interface StoryCardProps {
  story: Story;
}

const StoryCard = ({ story }: StoryCardProps) => {
  const navigate = useNavigate();
  const [isLoved, setIsLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(story.reactions.heart);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleLove = () => {
    setIsLoved(prev => {
      const newLoved = !prev;
      setLoveCount(prevCount => newLoved ? prevCount + 1 : prevCount - 1);
      return newLoved;
    });
  };

  const handleComments = () => {
    setIsCommentsOpen(true);
  };

  const handleRead = () => {
    navigate(`/read/${story.id}`);
  };

  // Progress ring SVG component
  const ProgressRing = ({ progress }: { progress: number }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-200"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <>
    <article 
      className="story-card bg-white rounded-3xl shadow-soft overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg h-full"
      style={{ 
        display: 'grid', 
        gridTemplateRows: 'auto 1fr auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Header: Cover Image with badges */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={story.cover}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: '20px 20px 0 0' }}
          loading="lazy"
        />
        
        {/* Badge - top left with max-width constraint */}
        {story.badge && (
          <div 
            className="absolute top-3 left-3"
            style={{ maxWidth: '70%' }}
          >
            <Badge 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-md text-xs font-medium px-2 py-1"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                lineHeight: 1
              }}
              title={story.badge}
            >
              {story.badge}
            </Badge>
          </div>
        )}
        
        {/* Rating chip - top right */}
        <div 
          className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-slate-700"
          style={{ 
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}
        >
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span style={{ minWidth: 0 }}>{story.rating}</span>
        </div>
      </div>

      {/* Body: Content area */}
      <div className="p-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {/* Title - 2 line clamp with ellipsis */}
        <h3 
          className="text-lg font-semibold text-slate-900 leading-tight"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'anywhere',
            lineHeight: '1.25',
            minHeight: '2.5rem' // Reserve space for 2 lines
          }}
          title={story.title}
        >
          {story.title}
        </h3>
        
        {/* Author and Meta */}
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          {/* Avatar */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-indigo-700" style={{ lineHeight: 1 }}>
                {story.author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          
          {/* Author name and meta - with proper truncation */}
          <div className="flex items-center gap-2 text-sm text-slate-600" style={{ minWidth: 0, flex: 1 }}>
            <span 
              className="font-medium"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                maxWidth: '120px'
              }}
              title={story.author.name}
            >
              {story.author.name}
            </span>
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span 
              className="flex-shrink-0"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0
              }}
            >
              {story.age}
            </span>
            <span className="text-slate-400 flex-shrink-0">•</span>
            <Badge 
              variant="secondary" 
              className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 border-0 flex-shrink-0"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                maxWidth: '80px',
                lineHeight: 1
              }}
              title={story.country}
            >
              {story.country}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Bar - pinned to bottom */}
      <div 
        className="p-4 pt-0"
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'nowrap',
          minHeight: '52px'
        }}
      >
        {/* Left: Action Pills */}
        <div 
          className="flex items-center gap-3"
          style={{ 
            flexWrap: 'nowrap',
            minWidth: 0,
            flex: '0 1 auto'
          }}
        >
          {/* Love Button */}
          <button
            onClick={handleLove}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              isLoved 
                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            )}
            style={{
              minHeight: '40px',
              minWidth: '44px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              lineHeight: 1
            }}
            aria-label="Love this story"
            title="Love this story"
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-all duration-200 flex-shrink-0",
                isLoved ? "fill-current" : ""
              )} 
            />
            <span className="text-sm font-medium">
              Love {formatNumber(loveCount)}
            </span>
          </button>

          {/* Comments Button - only show if comments > 0 */}
          {story.comments > 0 && (
            <button
              onClick={handleComments}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                minHeight: '40px',
                minWidth: '44px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                lineHeight: 1
              }}
              aria-label="Open comments"
              title="Open comments"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Comments {formatNumber(story.comments)}
              </span>
            </button>
          )}
        </div>

        {/* Right: Read Button */}
        <Button
          onClick={handleRead}
          className="rounded-full px-4 py-2 font-bold transition-all duration-200 flex-shrink-0 text-white shadow-md bg-[#22C55E] hover:bg-[#1FAA4B] active:bg-[#189A42] focus:ring-[#A7F3D0] hover:shadow-green-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            minHeight: '46px',
            minWidth: '44px',
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}
          aria-label="Read story"
          title="Read story"
        >
          Read
        </Button>
      </div>
    </article>

    {/* Comments Modal */}
    <CommentsModal 
      story={story}
      isOpen={isCommentsOpen}
      onClose={() => setIsCommentsOpen(false)}
    />
  </>
  );
};

export default StoryCard;