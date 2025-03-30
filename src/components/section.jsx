"use client"
import { products } from "../MouseSection"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"

const Section = () => {
  const navigate = useNavigate()

  const handleProductClick = (e, productId) => {
    e.preventDefault()

    // Get the clicked product element
    const productElement = e.currentTarget

    // Create animation
    gsap.to(productElement, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.3,
      onComplete: () => {
        // Navigate to product page after animation completes
        navigate(`/product/${productId}`)
      },
    })
  }

  return (
    <>
      {/* Pre-order */}
      <div className="bg-bg-primary">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Pre-Order Now</h2>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 max-[320px]:grid-cols-1 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative cursor-pointer product-card"
                onClick={(e) => handleProductClick(e, product.id)}
              >
                <div>
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc || "/placeholder.svg"}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4">
                    <h3 className="text-sm text-primary">{product.name}</h3>
                    <p className="mt-2 text-sm font-medium text-primary">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Sale */}
      <div className="bg-bg-secondary">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Hot Sales</h2>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 max-[320px]:grid-cols-1 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative cursor-pointer product-card"
                onClick={(e) => handleProductClick(e, product.id)}
              >
                <div>
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc || "/placeholder.svg"}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4">
                    <h3 className="text-sm text-primary">{product.name}</h3>
                    <p className="mt-2 text-sm font-medium text-primary">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <div className="bg-bg-primary">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Featured Products</h2>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 max-[320px]:grid-cols-1 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative cursor-pointer product-card"
                onClick={(e) => handleProductClick(e, product.id)}
              >
                <div>
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc || "/placeholder.svg"}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4">
                    <h3 className="text-sm text-primary">{product.name}</h3>
                    <p className="mt-2 text-sm font-medium text-primary">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Section

