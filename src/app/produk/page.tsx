import type { Metadata } from "next";
import { Suspense } from "react";
import { ProdukClient } from "@/components/ProdukClient";
import { isSlug, SERVICES } from "@/lib/catalog";

type Props = {
  searchParams: Promise<{ s?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { s } = await searchParams;
  const name = s && isSlug(s) ? SERVICES[s].name : "Produk";
  return { title: name };
}

export default function ProdukPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap" style={{ paddingTop: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            Memuat produk…
          </div>
        </main>
      }
    >
      <ProdukClient />
    </Suspense>
  );
}
