interface FooterLink {
  id: number;
  href: string;
  label: string;
  color: string;
}

export const Links: FooterLink[] = [
  { id: 0, href: "mailto:contact@timmypidashev.dev", label: "Contact", color: "text-green" },
  { id: 1, href: "https://github.com/timmypidashev", label: "Github", color: "text-yellow" },
  { id: 3, href: "https://www.linkedin.com/in/timothy-pidashev-4353812b8", label: "Linkedin", color: "text-blue" },
  { id: 4, href: "https://instagram.com/timmypidashev", label: "Instagram", color: "text-purple" },
  { id: 5, href: "https://github.com/timmypidashev/web", label: "Source", color: "text-aqua" },
];
