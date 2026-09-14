import React from "react";
import { ArrowRight } from "lucide-react";
import { availability } from "../data/catalog.js";

export function AvailabilityBadge({ status }) {
  return <span className={`availability availability-${status}`}>{availability[status] || availability["in-stock"]}</span>;
}

export function ProductTypeCard({ type, onClick, index }) {
  return (
    <button className="collection-card scroll-reveal" style={{ "--delay": `${index * 70}ms` }} onClick={onClick}>
      <div className="card-image">
        <img src={type.image} alt={type.name} />
      </div>
      <div className="card-copy">
        <span>{type.name}</span>
        <p>{type.description}</p>
        <strong>
          View products <ArrowRight size={16} />
        </strong>
      </div>
    </button>
  );
}

export function ProductCard({ product, onClick, index }) {
  return (
    <button className="product-card scroll-reveal" style={{ "--delay": `${index * 55}ms` }} onClick={onClick}>
      <div className="card-image">
        <img src={product.images[0]} alt={product.name} />
      </div>
      <div>
        <h3>{product.name}</h3>
        <strong>₹{product.price.toLocaleString("en-IN")}</strong>
        <AvailabilityBadge status={product.availability} />
      </div>
    </button>
  );
}
