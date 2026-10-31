import type { Metadata } from "next";
import { Suspense } from "react";
import { ProdukClient } from "@/components/ProdukClient";
import { isSlug, SERVICES } from "@/lib/catalog";
import { getStorefront } from "@/lib/catalog-hydrate";

type Props = {
  searchParams: Promise<{ s?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { s } = await searchParams;
  const slug = Array.isArray(s) ? s[0] : s;
  const name = slug && isSlug(slug) ? SERVICES[slug].name : "Produk";
  return { title: name };
}

export default async function ProdukPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = Array.isArray(params.s) ? params.s[0] : params.s;
  const slug = raw && isSlug(raw) ? raw : "pulsa";

  const storefront = await getStorefront();
  const qrisMethod =
    storefront.methods.find(
      (method) => method.name.toLowerCase() === "qris",
    ) ??
    storefront.methods[0] ??
    null;
  const service = storefront.services[slug];

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
      <ProdukClient
        key={slug}
        service={service}
        slug={slug}
        brandSlug={storefront.brand?.slug ?? ""}
        qrisMethodId={qrisMethod?.id ?? null}
      />
    </Suspense>
  );
}
