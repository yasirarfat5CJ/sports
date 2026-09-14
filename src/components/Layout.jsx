import React, { useState } from "react";
import { MapPin, Menu, MessageCircle, Phone, ShieldCheck, Store, X } from "lucide-react";
import { shop } from "../data/catalog.js";
import { Button } from "./Buttons.jsx";

export function Header({ isAdmin, onHome, onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${shop.whatsappNumber}`;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${menuOpen ? "menu-open" : ""}`}>
      <button className="wordmark" onClick={() => { closeMenu(); onHome(); }}>
        <span>{shop.name}</span>
        <small>{shop.location}</small>
      </button>
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#collections" onClick={closeMenu}>
          <Store size={16} />
          Products
        </a>
        <a href="#contact" onClick={closeMenu}>
          <Phone size={16} />
          Contact
        </a>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </nav>
      <Button variant="ghost" onClick={() => { closeMenu(); onAdmin(); }}>
        <ShieldCheck size={16} />
        {isAdmin ? "Admin" : "Login"}
      </Button>
    </header>
  );
}

export function Footer({ onAdmin }) {
  const whatsappUrl = `https://wa.me/${shop.whatsappNumber}`;

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-brand">
        <strong>{shop.name}</strong>
        <span>{shop.tagline}</span>
      </div>
      <div className="footer-contact">
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.location}`)}`} target="_blank" rel="noreferrer">
          <span className="footer-icon"><MapPin size={18} /></span>
          <span>
            <small>Location</small>
            {shop.location}
          </span>
        </a>
        {shop.phones.map((phone) => (
          <a href={`tel:${phone}`} key={phone}>
            <span className="footer-icon"><Phone size={18} /></span>
            <span>
              <small>Call</small>
              {phone}
            </span>
          </a>
        ))}
      </div>
      <div className="footer-actions">
        <a className="btn btn-secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <button onClick={onAdmin}>Admin Login</button>
      </div>
    </footer>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {text && <p>{text}</p>}
    </div>
  );
}
