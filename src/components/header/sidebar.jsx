"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Links, LinkColors } from "@/components/header/constants";

function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-45 flex justify-end transform -rotate-90 origin-top-left">
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transiton: {
              staggerChildren: 0.3
            }
          },
        }}
        className="
          flex flex-col justify-center items-center transform -translate-x-full
      ">
        <div className="flex space-x-10">
          {Links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: link.id * 0.2 }}
              className={`
                ${LinkColors[link.color]} dark:${LinkColors[link.color]}
              `}>
              <Link href={link.href}>{link.label}</Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </div>
  );
}
export default Sidebar;
