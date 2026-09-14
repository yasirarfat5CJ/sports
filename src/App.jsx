import React, { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Layout.jsx";
import { useCatalogStore } from "./hooks/useCatalogStore.js";
import { HomePage } from "./pages/HomePage.jsx";
import { CollectionPage } from "./pages/CollectionPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import {
  AdminDashboard,
  AdminLoginPage,
  ManageProductsPage,
  ManageTypesPage,
  ProductFormPage,
  TypeFormPage,
} from "./pages/AdminPages.jsx";

export default function App() {
  const store = useCatalogStore();
  const { admin, api, products, productTypes } = store;
  const [route, setRoute] = useState({ name: "home" });
  const [, forceRefresh] = useState(0);

  const currentType = useMemo(
    () => productTypes.find((type) => type.id === route.typeId),
    [productTypes, route.typeId],
  );
  const currentProduct = useMemo(
    () => products.find((product) => product.id === route.productId),
    [products, route.productId],
  );
  const collectionProducts = useMemo(
    () => products.filter((product) => product.productTypeId === route.typeId),
    [products, route.typeId],
  );

  function go(name, params = {}) {
    setRoute({ name, ...params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function refresh() {
    forceRefresh((value) => value + 1);
  }

  function logout() {
    api.logout();
    go("home");
  }

  useEffect(() => {
    const items = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [route.name, route.typeId, route.productId, products.length, productTypes.length]);

  const adminArea = route.name.startsWith("admin") && route.name !== "admin-login";
  let page;

  if (route.name === "collection") {
    page = (
      <CollectionPage
        type={currentType}
        products={collectionProducts}
        onBack={() => go("home")}
        onOpenProduct={(productId) => go("product", { productId, typeId: route.typeId })}
      />
    );
  } else if (route.name === "product") {
    page = <ProductDetailPage product={currentProduct} type={currentType} onBack={() => go("collection", { typeId: route.typeId })} />;
  } else if (route.name === "admin-login") {
    page = <AdminLoginPage api={api} onHome={() => go("home")} onSuccess={() => go("admin-dashboard")} />;
  } else if (adminArea && !admin) {
    page = <AdminLoginPage api={api} onHome={() => go("home")} onSuccess={() => go("admin-dashboard")} />;
  } else if (route.name === "admin-dashboard") {
    page = (
      <AdminDashboard
        productCount={store.productCount}
        productTypeCount={store.productTypeCount}
        onManageProducts={() => go("admin-products")}
        onManageTypes={() => go("admin-types")}
        onAddProduct={() => go("admin-product-form")}
        onAddType={() => go("admin-type-form")}
        onHome={() => go("home")}
        onLogout={logout}
      />
    );
  } else if (route.name === "admin-products") {
    page = (
      <ManageProductsPage
        api={api}
        products={products}
        types={productTypes}
        onBack={() => go("admin-dashboard")}
        onAdd={() => go("admin-product-form")}
        onEdit={(productId) => go("admin-product-form", { productId })}
        onRefresh={refresh}
      />
    );
  } else if (route.name === "admin-types") {
    page = (
      <ManageTypesPage
        api={api}
        types={productTypes}
        onBack={() => go("admin-dashboard")}
        onAdd={() => go("admin-type-form")}
        onEdit={(typeId) => go("admin-type-form", { typeId })}
        onRefresh={refresh}
      />
    );
  } else if (route.name === "admin-type-form") {
    page = (
      <TypeFormPage
        api={api}
        type={currentType}
        onBack={() => go("admin-types")}
        onSaved={() => go("admin-types")}
      />
    );
  } else if (route.name === "admin-product-form") {
    page = (
      <ProductFormPage
        api={api}
        product={currentProduct}
        types={productTypes}
        onBack={() => go("admin-products")}
        onSaved={() => go("admin-products")}
      />
    );
  } else {
    page = <HomePage types={productTypes} onOpenType={(typeId) => go("collection", { typeId })} onAdmin={() => go(admin ? "admin-dashboard" : "admin-login")} />;
  }

  return (
    <div className="app-shell">
      {!adminArea && <Header isAdmin={Boolean(admin)} onHome={() => go("home")} onAdmin={() => go(admin ? "admin-dashboard" : "admin-login")} />}
      <main>{page}</main>
    </div>
  );
}
