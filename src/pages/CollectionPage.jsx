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
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to collections</BackButton>
      <div className="mb-4">
        <span className="eyebrow">{type?.name || "Collection"}</span>
        <h1 className="display-6 fw-bold">{type?.description}</h1>
      </div>
      <SearchInput value={search} onChange={setSearch} />

      {filteredProducts.length ? (
        <div className="row g-4">
          {filteredProducts.map((product, index) => (
            <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
              <ProductCard product={product} index={index} onClick={() => onOpenProduct(product.id)} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" text="Try searching with another product name." />
      )}
    </section>
  );
}
