import React from "react";
import { Trophy } from "lucide-react";
import { Footer } from "../components/Layout.jsx";
import { ProductTypeCard } from "../components/ProductCards.jsx";
import { shop } from "../data/catalog.js";

export function HomePage({ types, onOpenType, onAdmin }) {
  return (
    <>
      <section className="container-xl py-4 py-lg-5">
        <div className="row align-items-center g-4 g-lg-5 min-vh-lg-75">
        <div className="col-lg-5">
          <span className="eyebrow">
            <Trophy size={16} />
            All your sports needs under one roof
          </span>
          <h1 className="display-1 fw-black text-uppercase lh-1 my-3">{shop.name}</h1>
          <p className="lead text-muted">
            Better gear for bigger dreams. Shop cricket gear, shoes, sunglasses, tracks, t-shirts, caps, and
            accessories from Kabeer Sports in New Bowenpally.
          </p>
          <div className="d-flex flex-wrap gap-2 my-4" aria-label="Shop highlights">
            <span className="badge text-bg-light border rounded-pill px-3 py-2">Cricket gear</span>
            <span className="badge text-bg-light border rounded-pill px-3 py-2">Tennis bats</span>
            <span className="badge text-bg-light border rounded-pill px-3 py-2">Cricket shoes</span>
            <span className="badge text-bg-light border rounded-pill px-3 py-2">Sports sunglasses</span>
          </div>
          <button className="btn btn-warning btn-lg fw-bold" onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}>
            Explore products
          </button>
        </div>
        <div className="col-lg-7">
        <div className="hero-banner shadow-lg">
          <img src="/images/banner/kabeer-sports-banner.jpeg" alt="Kabeer Sports shop banner" />
        </div>
        </div>
        </div>
      </section>

      <section className="container-xl py-5" id="collections">
        <div className="mb-4">
          <span className="eyebrow">Current catalog</span>
          <h2 className="display-6 fw-bold mb-0">Tennis bats, cricket shoes, and sports sunglasses</h2>
        </div>
        <div className="row g-4">
          {types.map((type, index) => (
            <div className="col-md-6 col-lg-4" key={type.id}>
              <ProductTypeCard type={type} index={index} onClick={() => onOpenType(type.id)} />
            </div>
          ))}
        </div>
      </section>

      <Footer onAdmin={onAdmin} />
    </>
  );
}
