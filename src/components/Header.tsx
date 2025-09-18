import { Search, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-[1280px] px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-ink">StoryWorlds</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-body font-medium text-ink border-b-2 border-indigo-600 pb-1">
            Home
          </a>
          <a href="#" className="text-body text-slate-700 hover:text-ink transition-colors">
            My Stories
          </a>
          <a href="#" className="text-body text-slate-700 hover:text-ink transition-colors">
            Create
          </a>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            <Input
              placeholder="dragon, forest..."
              className="w-[280px] lg:w-[420px] pl-10 h-11 rounded-full border-slate-200 focus-ring"
            />
          </div>
          
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="sm:hidden focus-ring">
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="focus-ring">
            <Bell className="w-4 h-4" />
          </Button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-700">E</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;