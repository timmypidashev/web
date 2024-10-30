interface FooterLink {
  id: number;
  href: string;
  label: string;
  color: string;
}

export const Links: FooterLink[] = [
  { id: 0, href: "https://add-later", label: "Contact", color: "green" },
  { id: 1, href: "https://github.com/timmypidashev", label: "Github", color: "yellow" },
  { id: 3, href: "https://linkedin.com/in/timothy-pidashev-9055922a7", label: "Linkedin", color: "blue" },
  { id: 4, href: "https://instagram.com/timmypidashev", label: "Instagram", color: "purple" },
  { id: 5, href: "https://github.com/timmypidashev/web", label: "Source", color: "aqua" },
];
