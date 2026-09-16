import React from "react";
import { ArrowRight } from "lucide-react";
import { availability } from "../data/catalog.js";

const fallbackImage = "/images/banner/kabeer-sports-banner.jpeg";

export function AvailabilityBadge({ status }) {
  return <span className={`badge rounded-pill availability availability-${status}`}>{availability[status] || availability["in-stock"]}</span>;
}

export function ProductTypeCard({ type, onClick, index }) {
  const image = type.image || fallbackImage;

  return (
    <button className="card catalog-card h-100 border-0 shadow-sm text-start scroll-reveal" style={{ "--delay": `${index * 70}ms` }} onClick={onClick}>
      <div className="product-media product-media-lg bg-white">
        <img src={image} alt={type.name} />
      </div>
      <div className="card-body d-flex flex-column gap-2">
        <h3 className="h4 fw-bold mb-0">{type.name}</h3>
        <p className="text-muted mb-2">{type.description}</p>
        <strong className="mt-auto d-inline-flex align-items-center gap-2 text-primary">
          View products <ArrowRight size={16} />
        </strong>
      </div>
    </button>
  );
}

export function ProductCard({ product, onClick, index }) {
  const image = product.images?.[0] || fallbackImage;

  return (
    <button className="card catalog-card h-100 border-0 shadow-sm text-start scroll-reveal" style={{ "--delay": `${index * 55}ms` }} onClick={onClick}>
      <div className="product-media bg-white">
        <img src={image} alt={product.name} />
      </div>
      <div className="card-body d-flex flex-column gap-2">
        <h3 className="h6 fw-bold mb-0">{product.name}</h3>
        <strong className="fs-4 text-primary">₹{product.price.toLocaleString("en-IN")}</strong>
        <AvailabilityBadge status={product.availability} />
      </div>
    </button>
  );
}
