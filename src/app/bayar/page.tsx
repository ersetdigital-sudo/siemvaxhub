import type { Metadata } from "next";
import { Suspense } from "react";
import { BayarClient } from "@/components/BayarClient";

export const metadata: Metadata = {
  title: "Pembayaran",
};

export default function BayarPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap" style={{ paddingTop: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            Memuat pembayaran…
          </div>
        </main>
      }
    >
      <BayarClient />
    </Suspense>
  );
}
