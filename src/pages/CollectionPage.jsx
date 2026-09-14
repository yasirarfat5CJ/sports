import React, { useMemo, useState } from "react";
import { BackButton } from "../components/Buttons.jsx";
import { EmptyState } from "../components/Layout.jsx";
import { ProductCard } from "../components/ProductCards.jsx";
import { SearchInput } from "../components/Forms.jsx";

export function CollectionPage({ type, products, onBack, onOpenProduct }) {
  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, search]);

  return (
    <section className="section page">
      <BackButton onClick={onBack}>Back to collections</BackButton>
      <div className="section-heading">
        <span>{type?.name || "Collection"}</span>
        <h1>{type?.description}</h1>
      </div>
      <SearchInput value={search} onChange={setSearch} />

      {filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onClick={() => onOpenProduct(product.id)} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" text="Try searching with another product name." />
      )}
    </section>
  );
}
