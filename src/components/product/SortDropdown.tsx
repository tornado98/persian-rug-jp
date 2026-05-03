// src/components/product/SortDropdown.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Props {
  currentSort: string;
}

export default function SortDropdown({ currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", e.target.value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="p-2.5 border border-primary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-400 outline-none"
    >
      <option value="createdAt-desc">新着順</option>
      <option value="price-asc">価格が安い順</option>
      <option value="price-desc">価格が高い順</option>
      <option value="title-asc">名前順 (A-Z)</option>
    </select>
  );
}
