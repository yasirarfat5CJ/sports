import React from "react";
import { Trophy } from "lucide-react";
import { Footer } from "../components/Layout.jsx";
import { ProductTypeCard } from "../components/ProductCards.jsx";
import { shop } from "../data/catalog.js";

export function HomePage({ types, onOpenType, onAdmin }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Trophy size={16} />
            All your sports needs under one roof
          </span>
          <h1>{shop.name}</h1>
          <p>
            Better gear for bigger dreams. Shop cricket gear, shoes, sunglasses, tracks, t-shirts, caps, and
            accessories from Kabeer Sports in New Bowenpally.
          </p>
          <div className="hero-pills" aria-label="Shop highlights">
            <span>Cricket gear</span>
            <span>Tennis bats</span>
            <span>Cricket shoes</span>
            <span>Sports sunglasses</span>
          </div>
          <button onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}>
            Explore products
          </button>
        </div>
        <div className="hero-banner">
          <img src="/images/banner/kabeer-sports-banner.jpeg" alt="Kabeer Sports shop banner" />
        </div>
      </section>

      <section className="section" id="collections">
        <div className="section-heading">
          <span>Current catalog</span>
          <h2>Tennis bats, cricket shoes, and sports sunglasses</h2>
        </div>
        <div className="collection-grid">
          {types.map((type, index) => (
            <ProductTypeCard key={type.id} type={type} index={index} onClick={() => onOpenType(type.id)} />
          ))}
        </div>
      </section>

      <Footer onAdmin={onAdmin} />
    </>
  );
}
