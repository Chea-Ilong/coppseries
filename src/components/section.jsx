import React from "react";
import ProductItem from "./ProductItem";

const products = [
  {
    alt: "Black machined steel pen with hexagonal grip and small white logo at top.",
    src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-product-01.jpg",
    color: "Black",
    name: "Machined Pen",
    price: "$35",
    availableColors: [
      { name: "Black", hex: "rgb(17, 24, 39)" },
      { name: "Brass", hex: "rgb(253, 230, 138)" },
      { name: "Chrome", hex: "rgb(229, 231, 235)" },
    ],
  },
  {
    alt: "Black porcelain mug with modern square handle and natural clay accents on rim and bottom.",
    src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-product-02.jpg",
    color: "Matte Black",
    name: "Earthen Mug",
    price: "$28",
    availableColors: [
      { name: "Matte Black", hex: "rgb(75, 85, 99)" },
      { name: "Natural", hex: "rgb(254, 243, 199)" },
    ],
  },
  {
    alt: "Natural leather journal with brass disc binding and three paper refill sets.",
    src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-product-03.jpg",
    color: "Natural",
    name: "Leatherbound Daily Journal Set",
    price: "$50",
    availableColors: [
      { name: "Natural", hex: "rgb(254, 243, 199)" },
      { name: "Black", hex: "rgb(31, 41, 55)" },
      { name: "Brown", hex: "rgb(124, 45, 18)" },
    ],
  },
  {
    alt: "Black leather journal with brass disc binding.",
    src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-product-04.jpg",
    color: "Black",
    name: "Leatherbound Daily Journal",
    price: "$50",
    availableColors: [
      { name: "Black", hex: "rgb(17, 24, 39)" },
      { name: "Brown", hex: "rgb(124, 45, 18)" },
      { name: "Natural", hex: "rgb(254, 243, 199)" },
    ],
  },
];

export default function Section() {
  return (
    <div className="auw cxq dlz dqf dwm">
      <div className="la aaz abe aua cwy dwi">
        <h2 className="ayi azo azt baw">Trending products</h2>
        <a href="#" className="ld ayp azr bbl bwa">
          See everything<span aria-hidden="true"> →</span>
        </a>
      </div>
      <div className="l hm">
        <div className="l iz vo afj aww">
          <ul role="list" className="fx lg ady cml dlx dnr drm dsr dti">
            {products.map((product, index) => (
              <ProductItem key={index} product={product} />
            ))}
          </ul>
        </div>
      </div>
      <div className="hq la aua cpb">
        <a href="#" className="ayp azr bbl bwa">
          See everything<span aria-hidden="true"> →</span>
        </a>
      </div>
    </div>
  );
}