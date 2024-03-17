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

const NavBar = () => {

  return (
    <div className="text-3xl font-bold text-gray-800">
      Navbar
    </div>
  );
}

export default NavBar;
