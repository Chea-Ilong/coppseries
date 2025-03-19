import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../MouseSection";
import { gsap } from "gsap";
import { useTheme } from "../context/ThemeContext";

export default function ProductOverview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const productRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  useEffect(() => {
    if (product && productRef.current) {
      // Initial state - hidden
      gsap.set(productRef.current, { opacity: 0, y: 20 });

      // Animate in
      gsap.to(productRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [product]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-bg-primary md:py-16 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="mb-6">
          <Link to="/" className="text-accent hover:underline">
            ← Back to Products
          </Link>
        </div>

        <div
          ref={productRef}
          className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16"
        >
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img
              className="w-full rounded-lg"
              src={product.imageSrc}
              alt={product.imageAlt}
            />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
              {product.name}
            </h1>
            <div className="flex items-center justify-between mt-4">
              <p className="text-3xl font-extrabold text-primary sm:text-4xl">
                {product.price}
              </p>
              <div className="flex items-center overflow-hidden border border-gray-300 dark:border-gray-700 rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                    theme === "light"
                      ? "hover:bg-gray-50"
                      : "hover:bg-gray-800"
                  }`}
                >
                  -
                </button>
                <span className="px-3 py-1 text-primary border-l border-r border-gray-300 dark:border-gray-700">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className={`px-3 py-1 text-lg text-primary focus:outline-none transition-all duration-150 ${
                    theme === "light"
                      ? "hover:bg-gray-50"
                      : "hover:bg-gray-800"
                  }`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-6">
              {/* <p className="text-lg text-secondary">Color: {product.color}</p>
              <p className="text-base text-secondary">{product.imageAlt}</p> */}

              <div className="mt-8">
                <button
                  type="button"
                  className={`w-full rounded-md bg-button px-5 py-3 text-base font-medium shadow-sm hover:bg-button-hover focus:outline-none transition-all duration-200 ease-in-out ${
                    theme === "light"
                      ? "text-gray-900 border border-transparent hover:border-gray-300"
                      : "text-white border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-10">
                <h3 className="text-sm font-medium text-primary mb-4">
                  Description
                </h3>
                <div className="prose prose-sm text-secondary mb-8">
                  <p>{product.description.overview}</p>
                </div>

                <h3 className="text-sm font-medium text-primary mb-4">
                  Tech Specs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary ">
                  {Object.entries(product.description.specs).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs uppercase font-medium">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}