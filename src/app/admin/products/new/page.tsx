// src/app/(admin)/admin/products/new/page.tsx
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary-900">New Product</h1>
      <ProductForm />
    </div>
  );
}
