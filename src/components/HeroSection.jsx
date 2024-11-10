import React from "react";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

const words = `Effortlessly create teams, share files, and chat in real-time, all within one powerful platform.`;

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <motion.div
        className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-6xl mb-10"
        initial={{ opacity: 0, y: -50 }} // Start off invisible and slightly above
        animate={{ opacity: 1, y: 0 }} // Fade in and move to original position
        exit={{ opacity: 0, y: 50 }} // Fade out and move down
        transition={{ duration: 1, ease: "easeInOut" }} // Transition settings
      >
        <motion.h1
          className="bg-clip-text py-10 text-transparent drop-shadow-2xl bg-gradient-to-b from-white/90 to-white/30"
          initial={{ scale: 0.9 }} // Slightly smaller on load
          animate={{ scale: 1 }} // Scale to normal size
          transition={{ duration: 0.5, ease: "easeInOut" }} // Transition for scaling
        >
          <div className="flex flex-col">
          <span className="text-6xl lg:text-9xl">Your Team, Your Rules</span>  <br/> Share and Collaborate Easily
          </div>
        </motion.h1>
        <TextGenerateEffect words={words} />
      </motion.div>
    </BackgroundGradientAnimation>
  );
}
