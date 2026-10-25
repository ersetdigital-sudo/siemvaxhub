"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { formatRp } from "@/lib/catalog";
import { WA_LINK, formatDateTime, loadOrders, type Order } from "@/lib/store";

export function InvoiceClient() {
  const search = useSearchParams();
  const idParam = (search.get("id") ?? "").trim().toUpperCase();
  const [query, setQuery] = useState(idParam);
  const [active, setActive] = useState(idParam);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const show = (value: string) => {
    const id = value.trim().toUpperCase();
    setQuery(id);
    setActive(id);
    if (id) {
      window.history.replaceState(null, "", `/invoice?id=${encodeURIComponent(id)}`);
    } else {
      window.history.replaceState(null, "", "/invoice");
    }
  };

  const order = active ? orders.find((entry) => entry.id === active) : undefined;

  return (
    <main className="wrap no-foot pb-12">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Cek Invoice" },
        ]}
      />

      <h1 style={{ fontSize: "clamp(38px,9vw,64px)", fontWeight: 900, marginTop: 20 }}>
        Cek invoice
      </h1>
      <p className="muted" style={{ marginTop: 8 }}>
        Masukkan kode invoice (format SVH-XXXXXX) untuk lihat status pesanan.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          show(query);
        }}
        style={{ display: "flex", gap: 8, marginTop: 20, maxWidth: 560 }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input"
          placeholder="SVH-XXXXXX"
          style={{ textTransform: "uppercase" }}
          aria-label="Kode invoice"
        />
        <button type="submit" className="btn btn-red" style={{ flex: "none" }}>
          Cari
        </button>
      </form>

      <div className="lay" style={{ marginTop: 24 }}>
        <div>
          {!active ? (
            <div className="card" style={{ padding: 28, maxWidth: 620 }}>
              <p className="muted">
                Belum ada invoice yang dicari. Masukkan kode di atas.
              </p>
            </div>
          ) : !order ? (
            <div className="card" style={{ padding: 28, maxWidth: 620 }}>
              <h3 style={{ fontSize: 22 }}>Invoice {active} nggak ketemu</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                Cek lagi kodenya, atau hubungi kami di{" "}
                <Link href="/bantuan#kontak" className="red" style={{ fontWeight: 600 }}>
                  pusat bantuan
                </Link>
                .
              </p>
            </div>
          ) : (
            <InvoiceCard order={order} />
          )}
        </div>

        <aside>
          <h3 style={{ fontSize: 20, marginBottom: 12 }}>Riwayat terakhir</h3>
          <div className="card hist">
            {orders.length ? (
              orders.slice(0, 5).map((entry) => (
                <Link key={entry.id} href={`/invoice?id=${entry.id}`}>
                  <div style={{ minWidth: 0 }}>
                    <b style={{ fontSize: 14 }}>{entry.id}</b>
                    <div
                      className="muted"
                      style={{
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.item} · {entry.target}
                    </div>
                  </div>
                  <b className="red fh" style={{ fontSize: 15, flex: "none" }}>
                    {formatRp(entry.amount)}
                  </b>
                </Link>
              ))
            ) : (
              <p className="muted" style={{ padding: 18, fontSize: 14 }}>
                Belum ada transaksi di browser ini.
              </p>
            )}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
            Catatan: ini masih simulasi. Riwayat hanya tersimpan di browser ini
            dan tidak ada transaksi sungguhan.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 12 }}
          >
            <Icon name="chat" className="h-4 w-4" /> Tanya via WhatsApp
          </a>
        </aside>
      </div>
    </main>
  );
}

function InvoiceCard({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="card card-pop inv">
      <div className="inv-h">
        <div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Kode invoice</div>
          <div className="fh" style={{ fontSize: 30, fontWeight: 900 }}>
            {order.id}
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            {formatDateTime(order.createdAt)}
          </div>
        </div>
        <span className="ok">
          <Icon name="clock" />
          Sedang diproses
        </span>
      </div>

      <dl className="rows">
        {[
          ["Produk", order.service],
          ["Provider", order.provider],
          ["Item", order.item],
          ["Tujuan", order.target],
          ["Metode bayar", order.method],
          ["Status", "Sedang diproses"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div style={{ border: 0, paddingTop: 16 }}>
          <dt style={{ color: "var(--ink)", fontWeight: 600 }}>Total dibayar</dt>
          <dd className="fh red" style={{ fontSize: 26 }}>
            {formatRp(order.amount)}
          </dd>
        </div>
      </dl>

      <div
        style={{
          padding: "0 24px 22px",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={copy} className="btn btn-ghost">
          {copied ? "✓ Tersalin!" : (
            <>
              <Icon name="copy" className="h-4 w-4" /> Salin kode
            </>
          )}
        </button>
        <Link href={`/produk?s=${order.slug}`} className="btn btn-red">
          Pesan lagi
        </Link>
      </div>
    </div>
  );
}
