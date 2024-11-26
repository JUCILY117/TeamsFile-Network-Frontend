import React from "react";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const words = `Effortlessly create teams, share files, and chat in real-time, all within one powerful platform.`;

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <motion.div
        className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-6xl mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <motion.h1
          className="bg-clip-text py-10 text-transparent drop-shadow-2xl bg-gradient-to-b from-white/90 to-white/30"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex flex-col">
          <span className="text-6xl lg:text-9xl">Your Team, Your Rules</span>  <br/>Share and Collaborate Easily
          </div>
        </motion.h1>
        <TextGenerateEffect words={words} />
      </motion.div>
    </BackgroundGradientAnimation>
  );
}
