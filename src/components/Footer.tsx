const Footer = () => {
    return (
      <footer className="mx-auto max-w-[1280px] px-10 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-700">
          <div>© StoryWorlds</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ink transition-colors focus-ring">
              Safety
            </a>
            <a href="#" className="hover:text-ink transition-colors focus-ring">
              Community Rules
            </a>
            <a href="#" className="hover:text-ink transition-colors focus-ring">
              Help
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;