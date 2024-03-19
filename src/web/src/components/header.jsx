"use client";

import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link";

const Header = () => {

  return (
    <div className="flex justify-center space-x-7">
      <Link href="/">Home</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/resume">Resume</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/shop">Shop</Link>
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
