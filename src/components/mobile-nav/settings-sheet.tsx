import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { applyTheme, getStoredThemeId } from "@/lib/themes/engine";
import { ANIMATION_IDS, ANIMATION_LABELS, type AnimationId } from "@/lib/animations";

const footerLinks = [
  { href: "mailto:contact@timmypidashev.dev", label: "Contact", color: "text-green" },
  { href: "https://github.com/timmypidashev", label: "Github", color: "text-yellow" },
  { href: "https://www.linkedin.com/in/timothy-pidashev-4353812b8", label: "LinkedIn", color: "text-blue" },
  { href: "https://github.com/timmypidashev/web", label: "Source", color: "text-purple" },
];

const themeOptions = [
  { id: "darkbox", label: "classic", color: "text-yellow-bright", activeBg: "bg-yellow-bright/15", activeBorder: "border-yellow-bright/40" },
  { id: "darkbox-retro", label: "retro", color: "text-orange-bright", activeBg: "bg-orange-bright/15", activeBorder: "border-orange-bright/40" },
  { id: "darkbox-dim", label: "dim", color: "text-purple-bright", activeBg: "bg-purple-bright/15", activeBorder: "border-purple-bright/40" },
];

const animOptions = [
  { id: "shuffle", color: "text-red-bright", activeBg: "bg-red-bright/15", activeBorder: "border-red-bright/40" },
  { id: "game-of-life", color: "text-green-bright", activeBg: "bg-green-bright/15", activeBorder: "border-green-bright/40" },
  { id: "lava-lamp", color: "text-orange-bright", activeBg: "bg-orange-bright/15", activeBorder: "border-orange-bright/40" },
  { id: "confetti", color: "text-yellow-bright", activeBg: "bg-yellow-bright/15", activeBorder: "border-yellow-bright/40" },
  { id: "asciiquarium", color: "text-aqua-bright", activeBg: "bg-aqua-bright/15", activeBorder: "border-aqua-bright/40" },
  { id: "pipes", color: "text-blue-bright", activeBg: "bg-blue-bright/15", activeBorder: "border-blue-bright/40" },
];

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentTheme, setCurrentTheme] = useState(getStoredThemeId());
  const [currentAnim, setCurrentAnim] = useState<string>("shuffle");

  useEffect(() => {
    setCurrentAnim(localStorage.getItem("animation") || "shuffle");
  }, [open]);

  const handleTheme = (id: string) => {
    applyTheme(id);
    setCurrentTheme(id);
    onClose();
  };

  const handleAnim = (id: string) => {
    localStorage.setItem("animation", id);
    document.documentElement.dataset.animation = id;
    document.dispatchEvent(new CustomEvent("animation-changed", { detail: { id } }));
    setCurrentAnim(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[70] bg-background border-t border-foreground/10 rounded-t-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-foreground/80 font-bold text-lg">Settings</span>
          <button onClick={onClose} className="p-2 text-foreground/50">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-6">
          {/* Theme */}
          <div>
            <div className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Theme</div>
            <div className="flex gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleTheme(opt.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                    currentTheme === opt.id
                      ? `${opt.activeBg} ${opt.color} ${opt.activeBorder}`
                      : "bg-foreground/5 text-foreground/40 border-transparent hover:text-foreground/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div>
            <div className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Animation</div>
            <div className="grid grid-cols-3 gap-2">
              {animOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnim(opt.id)}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition-colors duration-200 ${
                    currentAnim === opt.id
                      ? `${opt.activeBg} ${opt.color} ${opt.activeBorder}`
                      : "bg-foreground/5 text-foreground/40 border-transparent hover:text-foreground/60"
                  }`}
                >
                  {ANIMATION_LABELS[opt.id as AnimationId]}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Links</div>
            <div className="flex flex-wrap justify-center gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} inline-flex items-center gap-1 text-sm`}
                >
                  {link.label}
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
