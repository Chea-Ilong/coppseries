"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { slides } from "../Carousel";
import "../styles/carousel.css";

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [touchDistance, setTouchDistance] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  const minSwipeDistance = 30;
  const maxSwipeTime = 300;

  const goToPrevious = useCallback((e) => {
    // Stop event propagation to prevent it from affecting other components
    if (e) {
      e.stopPropagation();
    }
    setSlideDirection("slide-right");
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback((e) => {
    // Stop event propagation to prevent it from affecting other components
    if (e) {
      e.stopPropagation();
    }
    setSlideDirection("slide-left");
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  // Preload images
  useEffect(() => {
    const nextIndex = (index + 1) % slides.length;
    const prevIndex = index === 0 ? slides.length - 1 : index - 1;

    const preloadImages = [slides[nextIndex].src, slides[prevIndex].src].map(
      (src) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Add this to avoid CORS issues
        img.src = src;
        return img;
      }
    );
  }, [index]);

  // Reset slide direction after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideDirection("");
    }, 700);
    return () => clearTimeout(timer);
  }, [index]);

  // Auto-advance slides
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => goToNext(), 5000);
      return () => clearInterval(interval);
    }
  }, [goToNext, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keys if carousel is in viewport
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (!isInViewport) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault(); // Prevent default browser behavior
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault(); // Prevent default browser behavior
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const onTouchStart = (e) => {
    // Only handle touch if it started on the carousel
    if (!e.currentTarget.contains(e.target)) return;

    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartTime(Date.now());
    setTouchDistance(0);
  };

  const onTouchMove = (e) => {
    // Only handle touch if it started on the carousel
    if (touchStart === null) return;

    setTouchEnd(e.targetTouches[0].clientX);
    const distance = touchStart - e.targetTouches[0].clientX;

    // Add resistance at the edges
    if (
      (index === 0 && distance < 0) ||
      (index === slides.length - 1 && distance > 0)
    ) {
      setTouchDistance(distance * 0.3);
    } else {
      setTouchDistance(distance);
    }
  };

  const onTouchEnd = (e) => {
    // Only handle touch if it started on the carousel
    if (touchStart === null) return;

    setIsPaused(false);
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const time = Date.now() - touchStartTime;
    const velocity = Math.abs(distance / time);

    const isQuickSwipe =
      time < maxSwipeTime && Math.abs(distance) > minSwipeDistance;
    const isLongSwipe = Math.abs(distance) > minSwipeDistance * 2;

    if (isQuickSwipe || isLongSwipe) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative isolate z-10">
      <div
        className="relative w-full overflow-hidden rounded-xl"
        ref={containerRef}
      >
        <div
          className="relative flex justify-center items-center h-[500px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={goToPrevious}
            aria-label="Previous slide"
            className="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white
            transition-all duration-300 hover:bg-black/75 active:scale-95
            focus:outline-none focus:ring-offset-2 focus:ring-white"
          >
            <SlArrowLeft className="w-6 h-6" />
          </button>

          <div className="absolute w-full h-full overflow-hidden">
            <img
              src={slides[index].src || "/placeholder.svg"}
              alt={slides[index].alt}
              className={`w-full h-full object-cover carousel-image ${slideDirection}`}
              style={{
                backfaceVisibility: "hidden",
                perspective: "1000px",
                transform: `translateX(${touchDistance}px)`,
              }}
            />

            {/* Add the description and button overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div
                className={`absolute bottom-20 left-16 max-w-lg text-white p-6 slide-content ${
                  slideDirection ? "" : "active"
                }`}
              >
                <h2 className="text-3xl font-bold mb-2">
                  {slides[index].title}
                </h2>
                <p className="text-gray-200 mb-4">
                  {slides[index].description}
                </p>
                <a
                  href={slides[index].href}
                  className="inline-block px-6 py-2 bg-white text-black rounded-full
                  transform transition-all duration-300
                  hover:bg-opacity-90 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-white focus:ring-offset-2"
                >
                  Explore More
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white
            transition-all duration-300 hover:bg-black/75 active:scale-95
            focus:outline-none focus:ring-offset-2 focus:ring-white"
          >
            <SlArrowRight className="w-6 h-6" />
          </button>

          {/* Updated navigation dots */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={`block h-1 cursor-pointer rounded-2xl transition-all
                ${i === index ? "w-8 bg-white" : "w-4 bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
