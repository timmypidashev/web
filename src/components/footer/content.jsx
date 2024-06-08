"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/theme-toggle";

const Items = [
  { id: 0, href: "https://add-later", label: "Contact", color: "green", component: false },
  { id: 1, href: "https://github.com/timmypidashev", label: "Github", color: "yellow", component: false },
  { id: 3, href: "https://linkedin.com/in/timothy-pidashev-9055922a7", label: "Linkedin", color: "blue", component: false },
  { id: 4, href: "https://instagram.com/timmypidashev", label: "Instagram", color: "purple", component: false },
  { id: 5, href: "https://github.com/timmypidashev/web", label: "Source", color: "aqua", component: false },
  { id: 6, color: "foreground", component: true },
];

const ItemColors = {
  green: "text-light-green-1 dark:text-dark-green-1",
  yellow: "text-light-yellow-1 dark:text-dark-yellow-1",
  blue: "text-light-blue-1 dark:text-dark-blue-1",
  purple: "text-light-purple-1 dark:text-dark-purple-1",
  aqua: "text-light-aqua-1 dark:text-dark-aqua-1"
};

function Content() {
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.3
          }
        },
      }}
      className="
        fixed bottom-0 left-0 w-full z-50
        flex flex-row
        px-6 py-1.5
        font-bold text-2xl
        justify-center
    ">
      <div className="flex space-x-10">
        {Items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: item.id * 0.2 }}
            className={`
              inline-block
              ${ItemColors[item.color]} dark:${ItemColors[item.color]}
          `}>
            {item.component ? (
              <ThemeToggle />
            ) : (
              <Link href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
}

export default Content;
