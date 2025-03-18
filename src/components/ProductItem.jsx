import React from "react";

export default function ProductItem({ product }) {
  return (
    <li className="lg ul aas ayb dpw">
      <div className="bjm l">
        <img
          alt={product.alt}
          src={product.src}
          className="ob vo agd aku asz blm"
        />
        <div className="hk">
          <p className="ayp bas">{product.color}</p>
          <h3 className="hd azr baw">
            <a href="#">
              <span className="j u"></span>{product.name}
            </a>
          </h3>
          <p className="hd baw">{product.price}</p>
        </div>
      </div>
      <h4 className="i">Available colors</h4>
      <ul role="list" className="hx la aaz abf adt avk">
        {product.availableColors.map((color, index) => (
          <li key={index} className="ol agb ahg ahz" style={{ backgroundColor: color.hex }}>
            <span className="i">{color.name}</span>
          </li>
        ))}
      </ul>
    </li>
  );
};