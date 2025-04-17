import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hero4 from "../assets/hero4.png";

const images = [hero1, hero2, hero3, hero4];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden flex justify-center items-center bg-gray-200">
      <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
        <AnimatePresence>
          {isLoaded && (
            <motion.img
              key={index}
              src={images[index]}
              className="absolute w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hero;
