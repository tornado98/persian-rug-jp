// src/components/admin/AdminProductTable.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@prisma/client";
import {
  PlusCircle,
  Edit,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
} from "lucide-react";

interface Props {
  products: Product[];
}

const ITEMS_PER_PAGE = 8;

export default function AdminProductTable({ products }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<
    "title" | "price" | "createdAt" | "origin"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on search term
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.colorMain.toLowerCase().includes(q),
    );
  }, [products, search]);

  // Sort filtered products
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let valA: any, valB: any;
      switch (sortField) {
        case "title":
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case "price":
          valA = a.price;
          valB = b.price;
          break;
        case "origin":
          valA = a.origin.toLowerCase();
          valB = b.origin.toLowerCase();
          break;
        case "createdAt":
        default:
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
          break;
      }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const toggleSort = (field: "title" | "price" | "createdAt" | "origin") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-primary-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* Add button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-primary-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-primary-500">
            <Package className="mx-auto h-12 w-12 text-primary-300 mb-3" />
            <p className="text-lg font-medium">No products found</p>
            {search && (
              <p className="mt-1">
                No results for "{search}".{" "}
                <button
                  onClick={() => setSearch("")}
                  className="text-primary-600 hover:underline"
                >
                  Clear search
                </button>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-primary-50/80 text-primary-700 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-4 w-12">#</th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-primary-900 select-none"
                      onClick={() => toggleSort("title")}
                    >
                      Title <SortIcon field="title" />
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-primary-900 select-none"
                      onClick={() => toggleSort("price")}
                    >
                      Price <SortIcon field="price" />
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:text-primary-900 select-none"
                      onClick={() => toggleSort("origin")}
                    >
                      Origin <SortIcon field="origin" />
                    </th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100 text-sm">
                  {paginated.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-primary-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-primary-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-primary-900 flex items-center gap-3">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-400 text-xs">
                            N/A
                          </div>
                        )}
                        <span className="line-clamp-1">{product.title}</span>
                        {/* Slug missing warning */}
                        {!product.slug && (
                          <AlertTriangle
                            className="w-4 h-4 text-amber-500 flex-shrink-0"
                            title="Missing slug"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        ¥{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{product.origin}</td>
                      <td className="px-6 py-4">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product.slug ? (
                          <Link
                            href={`/admin/products/${product.slug}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-xs font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 text-xs italic cursor-not-allowed">
                            <AlertTriangle className="w-3 h-3" />
                            Missing slug
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination – unchanged */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-primary-100 bg-primary-50/30">
                <p className="text-xs text-primary-500">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + ITEMS_PER_PAGE, sorted.length)} of{" "}
                  {sorted.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-primary-600" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === currentPage
                            ? "bg-primary-600 text-white"
                            : "hover:bg-white text-primary-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-primary-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
