"use client"

import { motion } from "framer-motion";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      type: "tween",
      duration: 0.5, // You can adjust the duration as needed
    }}
  >
    {children}
  </motion.div>
);
export default PageTransition;
