// src/app/(admin)/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-primary-50 p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-3">
          <Link href="/admin" className="block hover:text-accent-light">
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block hover:text-accent-light"
          >
            Products
          </Link>
          <Link href="/admin/orders" className="block hover:text-accent-light">
            Orders (soon)
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 bg-primary-50">{children}</main>
    </div>
  );
}
