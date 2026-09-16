import React, { useState } from "react";
import { LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Button, BackButton } from "../components/Buttons.jsx";
import { Field } from "../components/Forms.jsx";
import { AvailabilityBadge } from "../components/ProductCards.jsx";

export function AdminLoginPage({ api, onHome, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const result = await api.login(email, password);
    if (result.ok) onSuccess();
    else setError(result.error);
  }

  return (
    <section className="admin-login">
      <form className="admin-panel reveal" onSubmit={submit}>
        <h1>Kabeer Sports Admin</h1>
        <p>Demo login: admin@kabeersports.com / Admin@123</p>
        <Field label="Email">
          <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" />
        </Field>
        <Field label="Password">
          <input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" />
        </Field>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit">Login</Button>
        <button className="text-link" type="button" onClick={onHome}>
          Back to shop
        </button>
      </form>
    </section>
  );
}

export function AdminDashboard({
  productCount,
  productTypeCount,
  onManageProducts,
  onManageTypes,
  onAddProduct,
  onAddType,
  onHome,
  onLogout,
}) {
  return (
    <section className="container-xl py-5 min-vh-100">
      <AdminTopbar title="Admin Dashboard" onHome={onHome} onLogout={onLogout} />
      <div className="stats-grid">
        <div>
          <span>Product types</span>
          <strong>{productTypeCount}</strong>
        </div>
        <div>
          <span>Products</span>
          <strong>{productCount}</strong>
        </div>
      </div>
      <div className="admin-actions">
        <Button onClick={onManageProducts}>Manage Products</Button>
        <Button variant="secondary" onClick={onAddProduct}>
          <Plus size={17} />
          Add Product
        </Button>
        <Button variant="secondary" onClick={onAddType}>
          <Plus size={17} />
          Add Product Type
        </Button>
        <Button variant="ghost" onClick={onManageTypes}>Manage Types</Button>
      </div>
    </section>
  );
}

export function ManageProductsPage({ products, types, api, onBack, onAdd, onEdit, onRefresh }) {
  const typeName = (id) => types.find((type) => type.id === id)?.name || "Unknown";

  async function removeProduct(productId) {
    await api.deleteProduct(productId);
    onRefresh();
  }

  return (
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to dashboard</BackButton>
      <div className="mb-4">
        <span className="eyebrow">Admin</span>
        <h1 className="display-6 fw-bold">Manage products</h1>
      </div>
      <Button className="admin-add-button" onClick={onAdd}>
        <Plus size={17} />
        Add Product
      </Button>
      <div className="admin-list">
        {products.map((product) => (
          <div className="admin-row" key={product.id}>
            <img src={product.images[0]} alt={product.name} />
            <div>
              <strong>{product.name}</strong>
              <span>{typeName(product.productTypeId)} · ₹{product.price.toLocaleString("en-IN")}</span>
              <AvailabilityBadge status={product.availability} />
            </div>
            <Button variant="ghost" onClick={() => onEdit(product.id)}>Edit</Button>
            <Button variant="danger" onClick={() => removeProduct(product.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ManageTypesPage({ types, api, onBack, onAdd, onEdit, onRefresh }) {
  async function removeType(typeId) {
    await api.deleteProductType(typeId);
    onRefresh();
  }

  return (
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to dashboard</BackButton>
      <div className="mb-4">
        <span className="eyebrow">Admin</span>
        <h1 className="display-6 fw-bold">Manage product types</h1>
      </div>
      <Button className="admin-add-button" onClick={onAdd}>
        <Plus size={17} />
        Add Product Type
      </Button>
      <div className="admin-list">
        {types.map((type) => (
          <div className="admin-row" key={type.id}>
            <img src={type.image} alt={type.name} />
            <div>
              <strong>{type.name}</strong>
              <span>{type.description}</span>
            </div>
            <Button variant="ghost" onClick={() => onEdit(type.id)}>
              <Pencil size={16} />
              Edit
            </Button>
            <Button variant="danger" onClick={() => removeType(type.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TypeFormPage({ type, api, onBack, onSaved }) {
  const [form, setForm] = useState(
    type || {
      name: "",
      description: "",
      image: "",
    },
  );

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim() || `https://picsum.photos/seed/kabeer-${form.name.trim().toLowerCase().replaceAll(" ", "-")}/900/650`,
    };

    if (type) await api.updateProductType(type.id, payload);
    else await api.addProductType(payload);

    onSaved();
  }

  return (
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to product types</BackButton>
      <form className="admin-panel wide" onSubmit={submit}>
        <h1>{type ? "Edit product type" : "Add product type"}</h1>
        <Field label="Type name">
          <input value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Example: Cricket Balls" required />
        </Field>
        <Field label="Short description">
          <textarea
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="Write what products this type contains"
            required
            rows="3"
          />
        </Field>
        <Field label="Image URL">
          <input value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="https://..." />
        </Field>
        <Button type="submit">
          <Save size={17} />
          Save product type
        </Button>
      </form>
    </section>
  );
}

export function ProductFormPage({ product, types, api, onBack, onSaved }) {
  const [form, setForm] = useState(
    product || {
      name: "",
      productTypeId: types[0]?.id || "",
      price: "",
      images: [""],
      description: "",
      availability: "in-stock",
      specifications: [{ label: "", value: "" }],
    },
  );

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images.filter(Boolean),
      specifications: form.specifications.filter((spec) => spec.label && spec.value),
    };
    if (product) await api.updateProduct(product.id, payload);
    else await api.addProduct(payload);
    onSaved();
  }

  return (
    <section className="container-xl py-5 min-vh-100">
      <BackButton onClick={onBack}>Back to products</BackButton>
      <form className="admin-panel wide" onSubmit={submit}>
        <h1>{product ? "Edit product" : "Add product"}</h1>
        <Field label="Product name">
          <input value={form.name} onChange={(event) => set("name", event.target.value)} required />
        </Field>
        <Field label="Product type">
          <select value={form.productTypeId} onChange={(event) => set("productTypeId", event.target.value)} required>
            {types.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Price">
          <input value={form.price} onChange={(event) => set("price", event.target.value)} required min="0" type="number" />
        </Field>
        <Field label="Image URL">
          <input value={form.images[0] || ""} onChange={(event) => set("images", [event.target.value])} required />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(event) => set("description", event.target.value)} required rows="4" />
        </Field>
        <Field label="Availability">
          <select value={form.availability} onChange={(event) => set("availability", event.target.value)}>
            <option value="in-stock">In stock</option>
            <option value="limited">Limited stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </Field>
        <Button type="submit">
          <Save size={17} />
          Save product
        </Button>
      </form>
    </section>
  );
}

function AdminTopbar({ title, onHome, onLogout }) {
  return (
    <div className="admin-topbar">
      <h1>{title}</h1>
      <div>
        <Button variant="ghost" onClick={onHome}>View shop</Button>
        <Button variant="danger" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  );
}
