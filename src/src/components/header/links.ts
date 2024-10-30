interface HeaderLink {
  id: number;
  href: string;
  label: string;
  color: string;
}

export const Links: HeaderLink[] = [
  { id: 0, href: "/", label: "Home", color: "green" },
  { id: 1, href: "projects", label: "Projects", color: "yellow" },
  { id: 2, href: "resume", label: "Resume", color: "blue" },
  { id: 3, href: "blog", label: "Blog", color: "purple" },
  { id: 4, href: "shop", label: "Shop", color: "aqua" }
];
