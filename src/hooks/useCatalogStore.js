import { useMemo, useState } from "react";
import { adminCredentials, products as initialProducts, productTypes as initialTypes } from "../data/catalog.js";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));
const id = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function useCatalogStore() {
  const [productTypes, setProductTypes] = useState(initialTypes);
  const [products, setProducts] = useState(initialProducts);
  const [admin, setAdmin] = useState(null);

  const api = useMemo(
    () => ({
      async listProductTypes() {
        await delay();
        return [...productTypes];
      },
      async getProductType(typeId) {
        await delay(150);
        return productTypes.find((type) => type.id === typeId) || null;
      },
      async listProducts({ typeId = "", search = "" } = {}) {
        await delay();
        const query = search.trim().toLowerCase();
        return products.filter((product) => {
          const matchesType = typeId ? product.productTypeId === typeId : true;
          const matchesSearch = query ? product.name.toLowerCase().includes(query) : true;
          return matchesType && matchesSearch;
        });
      },
      async getProduct(productId) {
        await delay(150);
        return products.find((product) => product.id === productId) || null;
      },
      async login(email, password) {
        await delay();
        const valid =
          email.trim().toLowerCase() === adminCredentials.email &&
          password.trim() === adminCredentials.password;
        if (!valid) return { ok: false, error: "Invalid email or password." };

        const session = { email: adminCredentials.email, role: "admin" };
        setAdmin(session);
        return { ok: true, admin: session };
      },
      logout() {
        setAdmin(null);
      },
      async addProductType(data) {
        const row = { id: id("type"), ...data };
        setProductTypes((current) => [...current, row]);
        return row;
      },
      async updateProductType(typeId, data) {
        setProductTypes((current) => current.map((type) => (type.id === typeId ? { ...type, ...data } : type)));
      },
      async deleteProductType(typeId) {
        setProductTypes((current) => current.filter((type) => type.id !== typeId));
        setProducts((current) => current.filter((product) => product.productTypeId !== typeId));
      },
      async addProduct(data) {
        const row = { id: id("product"), ...data };
        setProducts((current) => [...current, row]);
        return row;
      },
      async updateProduct(productId, data) {
        setProducts((current) => current.map((product) => (product.id === productId ? { ...product, ...data } : product)));
      },
      async deleteProduct(productId) {
        setProducts((current) => current.filter((product) => product.id !== productId));
      },
    }),
    [productTypes, products],
  );

  return {
    admin,
    api,
    products,
    productTypes,
    productCount: products.length,
    productTypeCount: productTypes.length,
  };
}
