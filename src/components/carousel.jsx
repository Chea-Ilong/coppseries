import { useEffect, useState, useCallback } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { slides } from "../Carousel";

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState(""); // Add this state

  const minSwipeDistance = 50;

  const goToPrevious = useCallback(() => {
    setSlideDirection("slide-right");
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setSlideDirection("slide-left");
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  // Reset slide direction after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideDirection("");
    }, 500);
    return () => clearTimeout(timer);
  }, [index]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full overflow-hidden">
        <style jsx>{`
          @keyframes slideLeft {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes slideRight {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .slide-left {
            animation: slideLeft 0.5s ease-out;
          }
          .slide-right {
            animation: slideRight 0.5s ease-out;
          }
        `}</style>

        <div
          className="relative flex justify-center items-center h-[400px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            onClick={goToPrevious}
            aria-label="Previous slide"
            className="absolute left-4 z-10 p-3 rounded-full bg-white/80 shadow-lg 
            transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
          >
            <SlArrowLeft className="w-6 h-6 text-gray-800" />
          </button>

          <div className="absolute w-full h-full overflow-hidden">
            <img
              src={slides[index].src}
              alt={slides[index].alt}
              className={`w-full h-full object-cover ${slideDirection}`}
            />
          </div>

          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-4 z-10 p-3 rounded-full bg-white/80 shadow-lg 
            transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
          >
            <SlArrowRight className="w-6 h-6 text-gray-800" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform
                ${i === index ? "bg-white scale-125" : "bg-white/50"}
                hover:scale-150 hover:bg-white`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
