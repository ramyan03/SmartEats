import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="img-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x600?text=SmartEats";
            }}
          />
        </div>

        <div className="card-body">
          <div className="meta">
            <span className="badge">{product.category}</span>
          </div>

          <h3 className="title">{product.name}</h3>
          <p className="desc">{product.description}</p>

          <div className="row">
            <span className="price">${product.price.toFixed(2)}</span>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                onAdd?.(product);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
