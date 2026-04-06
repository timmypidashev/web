import { useState, useEffect, useRef } from "react";
import { Home, User, FolderOpen, BookOpen, FileText, Settings } from "lucide-react";
import { SettingsSheet } from "./settings-sheet";

const tabs = [
  { href: "/", label: "Home", icon: Home, color: "text-green" },
  { href: "/about", label: "About", icon: User, color: "text-yellow" },
  { href: "/projects", label: "Projects", icon: FolderOpen, color: "text-blue" },
  { href: "/blog", label: "Blog", icon: BookOpen, color: "text-purple" },
  { href: "/resume", label: "Resume", icon: FileText, color: "text-aqua" },
];

export default function MobileNav({ transparent = false }: { transparent?: boolean }) {
  const [path, setPath] = useState("/");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = document.documentElement.scrollTop;
      const now = Date.now();
      const dt = now - lastTime.current;
      const dy = lastScrollY.current - y; // positive = scrolling up
      const velocity = dt > 0 ? dy / dt : 0; // px/ms

      if (y < 10) {
        setVisible(true);
      } else if (dy > 0 && velocity > 1.5) {
        // Fast upward scroll
        setVisible(true);
      } else if (dy < 0) {
        // Scrolling down
        setVisible(false);
      }

      lastScrollY.current = y;
      lastTime.current = now;
    };
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return path === "/";
    return path.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        } ${
          transparent
            ? "bg-transparent"
            : "bg-background border-t border-foreground/10"
        }`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          touchAction: "manipulation",
        }}
      >
        <div className="flex items-center justify-around px-1 h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <a
                key={tab.href}
                href={tab.href}
                data-astro-reload
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 ${
                  active ? tab.color : "text-foreground/40"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[10px]">{tab.label}</span>
              </a>
            );
          })}
          <button
            onClick={() => setSettingsOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 ${
              settingsOpen ? "text-foreground" : "text-foreground/40"
            }`}
          >
            <Settings size={20} strokeWidth={1.5} />
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
