import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { BackButton, Button } from "../components/Buttons.jsx";
import { AvailabilityBadge } from "../components/ProductCards.jsx";
import { shop } from "../data/catalog.js";

export function ProductDetailPage({ product, type, onBack }) {
  const [activeImage, setActiveImage] = useState(0);
  const images = product?.images?.length ? product.images : [];

  if (!product) {
    return (
      <section className="container-xl py-5 min-vh-100">
        <BackButton onClick={onBack}>Back</BackButton>
        <p>Product not found.</p>
      </section>
    );
  }

  const activeImageUrl = images[activeImage]?.startsWith("http")
    ? images[activeImage]
    : `${window.location.origin}${images[activeImage]}`;
  const whatsappMessage = [
    `Hi ${shop.name}, I want to buy this product:`,
    product.name,
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    `Image: ${activeImageUrl}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to {type?.name || "collection"}</BackButton>
      <div className="row g-4 g-lg-5 align-items-start">
      <div className="col-lg-6">
      <div className="card border-0 shadow-sm p-3 product-detail-card">
        <div className="detail-media">
        <img className="product-detail-img" src={images[activeImage]} alt={product.name} />
        {images.length > 1 && (
          <div className="d-flex gap-2 mt-3 overflow-auto">
            {images.map((image, index) => (
              <button className={`thumb-button ${index === activeImage ? "active" : ""}`} key={image} onClick={() => setActiveImage(index)}>
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
      </div>
      <article className="col-lg-6">
        <span className="eyebrow">{type?.name}</span>
        <h1 className="display-5 fw-bold mt-2">{product.name}</h1>
        <strong className="d-block fs-2 text-primary mb-2">₹{product.price.toLocaleString("en-IN")}</strong>
        <AvailabilityBadge status={product.availability} />
        <p className="lead text-muted mt-4">{product.description}</p>
        <Button className="btn-lg my-3" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}>
          <MessageCircle size={18} />
          Buy on WhatsApp
        </Button>
        <dl className="list-group mt-4">
          {product.specifications.map((spec) => (
            <div className="list-group-item d-flex justify-content-between gap-3" key={spec.label}>
              <dt className="text-muted">{spec.label}</dt>
              <dd className="mb-0 fw-bold">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </article>
      </div>
    </section>
  );
}
