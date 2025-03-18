import { useEffect } from "react";
import { Collapse, Dropdown, initTWE } from "tw-elements";
import { slides } from "../Carousel";

const Carousel = () => {
  useEffect(() => {
    initTWE({ Collapse, Dropdown });
  }, []);

  // Carousel data - you can easily add more slides here

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div
          id="carouselExampleCaptions"
          className="relative"
          data-twe-carousel-init
          data-twe-ride="carousel"
        >
          {/* Indicators */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
            data-twe-carousel-indicators
          >
            {slides.map((slide) => (
              <button
                key={`indicator-${slide.id}`}
                type="button"
                data-twe-target="#carouselExampleCaptions"
                data-twe-slide-to={slide.id}
                data-twe-carousel-active={slide.id === 0 ? true : undefined}
                className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
                aria-current={slide.id === 0 ? "true" : undefined}
                aria-label={`Slide ${slide.id + 1}`}
              ></button>
            ))}
          </div>

          {/* Slides */}
          <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
            {slides.map((slide, index) => (
              <div
                key={`slide-${slide.id}`}
                className={`relative float-left -mr-[100%] ${index === 0 ? "" : "hidden"} w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none`}
                data-twe-carousel-active={index === 0 ? true : undefined}
                data-twe-carousel-item
                style={{ backfaceVisibility: "hidden" }}
              >
                <img
                  src={slide.image}
                  className="block w-full"
                  alt={slide.title}
                />
                <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
                  <h5 className="text-xl">{slide.title}</h5>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
            type="button"
            data-twe-target="#carouselExampleCaptions"
            data-twe-slide="prev"
          >
            <span className="inline-block h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Previous
            </span>
          </button>
          <button
            className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
            type="button"
            data-twe-target="#carouselExampleCaptions"
            data-twe-slide="next"
          >
            <span className="inline-block h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Next
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
export default Carousel;