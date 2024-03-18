"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems= [
  {
    path: "/",
    name: "Home"
  },
  {
    path: "/projects",
    name: "Projects"
  },
  {
    path: "/resume",
    name: "Resume"
  },
  {
    path: "/blog",
    name: "Blog"
  },
  {
    path: "/shop",
    name: "Shop"
  }
]

const Header = () => {

  return (
    <div className="text-gray-800 hover:text-blue-500 cursor-pointer">
      Navbar
    </div>
  );
}

export default Header;
