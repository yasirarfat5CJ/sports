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
      <section className="section page">
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
    <section className="product-detail section page">
      <BackButton onClick={onBack}>Back to {type?.name || "collection"}</BackButton>
      <div className="detail-media reveal">
        <img src={images[activeImage]} alt={product.name} />
        {images.length > 1 && (
          <div className="thumb-row">
            {images.map((image, index) => (
              <button className={index === activeImage ? "active" : ""} key={image} onClick={() => setActiveImage(index)}>
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      <article className="detail-copy reveal">
        <span className="eyebrow">{type?.name}</span>
        <h1>{product.name}</h1>
        <strong className="price">₹{product.price.toLocaleString("en-IN")}</strong>
        <AvailabilityBadge status={product.availability} />
        <p>{product.description}</p>
        <Button className="buy-button" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}>
          <MessageCircle size={18} />
          Buy on WhatsApp
        </Button>
        <dl>
          {product.specifications.map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}
