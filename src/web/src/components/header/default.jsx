"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Links, LinkColors } from "@/components/header/constants";

function DefaultHeader() {
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
        fixed top-0 left-0 w-full
        hidden 2xl:flex xl:flex lg:flex md:flex flex-row
        lg:px-6 md:px-5 sm:px-4 lg:py-1.5 md:py-1.5
        lg:text-4xl md:text-3xl
        font-bold justify-center
    ">
      <div className="flex lg:space-x-20 md:space-x-10">
        {Links.map((link) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: link.id * 0.2 }}
            className={`
              inline-block
              ${LinkColors[link.color]} dark:${LinkColors[link.color]}
            `}>
            <Link href={link.href}>{link.label}</Link>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
}

export default DefaultHeader;
