interface HeaderLink {
  id: number;
  href: string;
  label: string;
  color: string;
}

export const Links: HeaderLink[] = [
  { id: 0, href: "/", label: "Home", color: "text-green" },
  { id: 1, href: "projects", label: "Projects", color: "text-yellow" },
  { id: 2, href: "resume", label: "Resume", color: "text-blue" },
  { id: 3, href: "blog", label: "Blog", color: "text-purple" },
  { id: 4, href: "shop", label: "Shop", color: "text-aqua" }
];
