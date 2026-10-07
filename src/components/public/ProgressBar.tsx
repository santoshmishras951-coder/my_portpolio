import React from 'react';
import { motion, useScroll } from 'motion/react';

export const ProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
