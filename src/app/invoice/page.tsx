import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceClient } from "@/components/InvoiceClient";

export const metadata: Metadata = {
  title: "Cek Invoice",
};

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <main className="wrap" style={{ paddingTop: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            Memuat invoice…
          </div>
        </main>
      }
    >
      <InvoiceClient />
    </Suspense>
  );
}
