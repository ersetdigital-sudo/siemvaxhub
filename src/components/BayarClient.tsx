"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { formatRp, SERVICES } from "@/lib/catalog";
import {
  ADMIN_WA,
  PAID_MESSAGE,
  QRIS_IMAGE,
  formatDate,
  waLink,
} from "@/lib/store";

type PublicStatus = "success" | "processing" | "pending" | "expired";

type ApiOrder = {
  inv: string;
  status: PublicStatus;
  service: string;
  product: string;
  lines: [string, string][];
  method: string;
  total: number;
  sn: string;
  label: string;
  created: number;
  updated: number;
  paidAt?: number;
  qris: string | null;
};

const statusText: Record<PublicStatus, string> = {
  pending: "Menunggu pembayaran",
  processing: "Sedang diproses",
  success: "Selesai",
  expired: "Dibatalkan",
};

function slugOf(name: string) {
  const entry = Object.entries(SERVICES).find(([, service]) => service.name === name);
  return entry ? entry[0] : "pulsa";
}

export function BayarClient() {
  const search = useSearchParams();
  const id = (search.get("id") ?? "").trim().toUpperCase();
  const [order, setOrder] = useState<ApiOrder | null | undefined>(undefined);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setOrder(null);
      return;
    }
    setOrder(undefined);
    fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (alive) setOrder((data as ApiOrder | null) ?? null);
      })
      .catch(() => {
        if (alive) setOrder(null);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const copyId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.inv);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (order === undefined) {
    return (
      <main className="wrap no-foot pt-8">
        <div className="card" style={{ padding: 28 }}>
          Memuat pembayaran…
        </div>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className="wrap no-foot" style={{ paddingTop: 24 }}>
        <div
          className="card card-pop"
          style={{ maxWidth: 520, margin: "48px auto", padding: 36, textAlign: "center" }}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--soft)",
              color: "var(--red)",
              display: "inline-grid",
              placeItems: "center",
            }}
          >
            <Icon name="receipt" />
          </span>
          <h1 style={{ fontSize: 34, margin: "18px 0 8px" }}>Pesanan nggak ketemu</h1>
          <p className="muted" style={{ marginBottom: 22 }}>
            Kode pesanan tidak cocok dengan data server. Pilih produk dulu atau
            cek invoice yang sudah ada.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <Link href="/produk?s=pulsa" className="btn btn-red">
              Pilih produk
            </Link>
            <Link href="/invoice" className="btn btn-ghost">
              Cek invoice
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const target =
    order.lines.find(([label]) => /tujuan/i.test(label))?.[1] ?? "-";
  const activeStatus = paid ? "processing" : order.status;
  const canPay = activeStatus === "pending";
  const waMessage = waLink(
    `Halo, saya sudah bayar pesanan ${order.inv} sebesar ${formatRp(order.total)}. Mohon dicek ya.`,
  );

  return (
    <>
      <main className="wrap no-foot pad-bar">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Cek Invoice", href: "/invoice" },
            { label: "Pembayaran" },
          ]}
        />

        <Link
          href={`/produk?s=${slugOf(order.service)}`}
          className="muted"
          style={{
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            fontSize: 14,
            fontWeight: 600,
            marginTop: 20,
          }}
        >
          ← Ubah pesanan
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <h1 style={{ fontSize: "clamp(36px,8vw,56px)", fontWeight: 900 }}>
            {paid
              ? "Pembayaran diterima"
              : activeStatus === "success"
                ? "Pesanan selesai"
                : activeStatus === "expired"
                  ? "Pesanan dibatalkan"
                  : "Pembayaran"}
          </h1>
          <span
            className="badge"
            style={{
              background:
                activeStatus === "success" || paid
                  ? "var(--soft)"
                  : activeStatus === "expired"
                    ? "var(--soft)"
                    : "var(--orange)",
              color:
                activeStatus === "success" || paid || activeStatus === "expired"
                  ? "var(--red)"
                  : "var(--ink)",
            }}
          >
            {activeStatus === "success" || paid
              ? "✓ Selesai"
              : activeStatus === "processing"
                ? "⏳ Sedang diproses"
                : activeStatus === "expired"
                  ? "✕ Dibatalkan"
                  : "⏳ Menunggu pembayaran"}
          </span>
        </div>

        <div className="lay" style={{ marginTop: 20 }}>
          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "minmax(0, 1fr)",
            }}
          >
            <div className="card step">
              {!canPay ? (
                <div style={{ padding: "24px 8px", textAlign: "center" }}>
                  <span
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: "var(--soft)",
                      color: "var(--red)",
                      display: "inline-grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon name={activeStatus === "expired" ? "clock" : "check"} className="h-8 w-8" />
                  </span>
                  <h2
                    className="fh"
                    style={{ fontSize: "clamp(26px,6vw,40px)", margin: "20px auto 10px", maxWidth: 460 }}
                  >
                    {paid
                      ? PAID_MESSAGE
                      : activeStatus === "success"
                        ? "Terima kasih, pesanan sudah selesai"
                        : "Pesanan sudah dibatalkan"}
                  </h2>
                  <p className="muted" style={{ maxWidth: 440, margin: "0 auto" }}>
                    {paid
                      ? "Pembayaran QRIS kamu dicek tim kami, lalu pesanan diteruskan ke provider."
                      : activeStatus === "success"
                        ? "Produk sudah dikirim. Cek detail dan SN di halaman invoice."
                        : "Pesanan ini sudah tidak aktif. Silakan buat pesanan baru bila perlu."}{" "}
                    Pantau statusnya dengan kode{" "}
                    <b style={{ color: "var(--ink)" }}>{order.inv}</b>.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginTop: 24,
                    }}
                  >
                    <Link href={`/invoice?id=${order.inv}`} className="btn btn-red">
                      Cek invoice <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <a
                      href={waMessage}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                    >
                      <Icon name="chat" className="h-4 w-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="step-h">
                    <span className="step-n">1</span>
                    <h3>Scan QRIS</h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                        Total bayar
                      </div>
                      <div className="fh" style={{ fontSize: "clamp(38px,9vw,56px)", fontWeight: 900 }}>
                        {formatRp(order.total)}
                      </div>
                      <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                        {order.inv} · {formatDate(order.created)}
                      </div>
                    </div>
                    <span className="badge" style={{ background: "var(--soft)" }}>
                      Gratis biaya
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      marginTop: 18,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 280,
                        background: "#fff",
                        border: "1.5px solid var(--line)",
                        borderRadius: 18,
                        padding: 12,
                        flex: "none",
                      }}
                    >
                      <img
                        src={order.qris || QRIS_IMAGE}
                        alt="Kode QRIS untuk pembayaran pesanan"
                        width={520}
                        height={520}
                        style={{ display: "block", width: "100%", borderRadius: 10 }}
                      />
                    </div>
                    <ol
                      style={{
                        display: "grid",
                        gap: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.5,
                        flex: 1,
                        minWidth: 220,
                      }}
                    >
                      {[
                        "Buka aplikasi bank atau e-wallet pilihanmu.",
                        "Pilih menu bayar QRIS, lalu scan kode di samping.",
                        `Periksa nominal ${formatRp(order.total)} dan selesaikan pembayaran.`,
                        'Tekan "Saya sudah bayar" setelah transaksi berhasil.',
                      ].map((text, index) => (
                        <li key={text} style={{ display: "flex", gap: 10 }}>
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              background: "var(--soft)",
                              color: "var(--red)",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 12,
                              fontWeight: 800,
                              flex: "none",
                            }}
                          >
                            {index + 1}
                          </span>
                          {text}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <button
                    type="button"
                    className="btn btn-red"
                    style={{ width: "100%", marginTop: 22 }}
                    onClick={() => setPaid(true)}
                  >
                    Saya sudah bayar
                  </button>
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ width: "100%", marginTop: 10 }}
                  >
                    <Icon name="chat" className="h-4 w-4" /> Konfirmasi via WhatsApp
                  </a>
                  <p
                    className="muted"
                    style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}
                  >
                    Pembayaran dicek manual · simpan kode {order.inv}
                  </p>
                </>
              )}
            </div>
          </div>

          <aside className="card card-pop sum">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ fontSize: 20 }}>Ringkasan pesanan</h3>
              <button
                type="button"
                onClick={copyId}
                className="muted"
                style={{ fontSize: 12, fontWeight: 700, display: "inline-flex", gap: 4 }}
              >
                <Icon name="copy" className="h-4 w-4" />
                {copied ? "Tersalin!" : "Salin kode"}
              </button>
            </div>
            <dl style={{ marginTop: 10 }}>
              {[
                ["Produk", order.service],
                ["Item", order.product],
                ["Tujuan", target],
                ["Metode", order.method],
                ["Status", statusText[activeStatus]],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                margin: "14px 0",
              }}
            >
              <span className="muted">Total bayar</span>
              <b className="fh red" style={{ fontSize: 30 }}>
                {formatRp(order.total)}
              </b>
            </div>
            <div
              style={{
                background: "var(--bg)",
                borderRadius: 14,
                padding: 12,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              Pembayaran QRIS diverifikasi manual oleh tim. Simpan kode invoice
              untuk cek status.
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
              Butuh bantuan? WhatsApp {ADMIN_WA}.{" "}
              {order.service} diproses setelah pembayaran dicek.
            </p>
          </aside>
        </div>
      </main>

      <div className="fbar">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="st">
            {order.inv} · {statusText[activeStatus].toLowerCase()}
          </div>
          <div className="tt">{formatRp(order.total)}</div>
        </div>
        {canPay ? (
          <button type="button" className="btn btn-red" onClick={() => setPaid(true)}>
            Saya sudah bayar
          </button>
        ) : (
          <Link href={`/invoice?id=${order.inv}`} className="btn btn-red">
            Cek
          </Link>
        )}
      </div>
    </>
  );
}
