import React, { useState } from "react";
import { MapPin, Menu, MessageCircle, Phone, ShieldCheck, Store, X } from "lucide-react";
import { shop } from "../data/catalog.js";
import { Button } from "./Buttons.jsx";

export function Header({ isAdmin, onHome, onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${shop.whatsappNumber}`;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky-top glass-header">
      <nav className="navbar navbar-expand-md">
        <div className="container-xl">
          <button className="navbar-brand border-0 bg-transparent p-0 text-start" onClick={() => { closeMenu(); onHome(); }}>
            <span className="d-block fw-black text-uppercase lh-1 brand-title">{shop.name}</span>
            <small className="text-muted fw-semibold">{shop.location}</small>
          </button>
          <button
            className="navbar-toggler border-0 shadow-sm bg-white"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div className={`navbar-collapse ${menuOpen ? "show" : "collapse"}`}>
            <div className="navbar-nav mx-auto gap-md-2 py-3 py-md-0">
              <a className="nav-link fw-semibold d-flex align-items-center gap-2" href="#collections" onClick={closeMenu}>
                <Store size={16} />
                Products
              </a>
              <a className="nav-link fw-semibold d-flex align-items-center gap-2" href="#contact" onClick={closeMenu}>
                <Phone size={16} />
                Contact
              </a>
              <a className="nav-link fw-semibold d-flex align-items-center gap-2" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
            <Button variant="ghost" className="w-100 w-md-auto" onClick={() => { closeMenu(); onAdmin(); }}>
              <ShieldCheck size={16} />
              {isAdmin ? "Admin" : "Login"}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Footer({ onAdmin }) {
  const whatsappUrl = `https://wa.me/${shop.whatsappNumber}`;

  return (
    <footer className="container-xl py-5" id="contact">
      <div className="footer-panel row g-4 align-items-start">
      <div className="col-lg-5">
        <strong className="d-block h3 fw-black text-uppercase mb-2">{shop.name}</strong>
        <p className="text-muted mb-0">{shop.tagline}</p>
      </div>
      <div className="col-lg-4 d-grid gap-2">
        <a className="contact-chip" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.location}`)}`} target="_blank" rel="noreferrer">
          <span className="icon-chip"><MapPin size={18} /></span>
          <span><small>Location</small>{shop.location}</span>
        </a>
        {shop.phones.map((phone) => (
          <a className="contact-chip" href={`tel:${phone}`} key={phone}>
            <span className="icon-chip"><Phone size={18} /></span>
            <span><small>Call</small>{phone}</span>
          </a>
        ))}
      </div>
      <div className="col-lg-3 d-grid gap-2">
        <a className="btn btn-warning fw-semibold d-inline-flex align-items-center justify-content-center gap-2" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <button className="btn btn-link fw-semibold" onClick={onAdmin}>Admin Login</button>
      </div>
      </div>
    </footer>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="text-center py-5 text-muted">
      <strong className="d-block h4 text-dark">{title}</strong>
      {text && <p>{text}</p>}
    </div>
  );
}
