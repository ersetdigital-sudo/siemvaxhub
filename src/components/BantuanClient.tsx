"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ADMIN_WA, WA_LINK } from "@/lib/store";

type Faq = {
  cat: "Pembayaran" | "Pesanan" | "Akun";
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    cat: "Pembayaran",
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Semua pesanan dibayar lewat QRIS. Satu kode bisa discan dari aplikasi bank atau e-wallet apa pun: BCA, Mandiri, BRI, DANA, OVO, GoPay, ShopeePay, dan lainnya. Tanpa biaya tambahan.",
  },
  {
    cat: "Pembayaran",
    q: "Sudah bayar tapi status belum berubah?",
    a: "Pembayaran dicek manual oleh tim. Tekan tombol Saya sudah bayar, lalu kirim kode invoice ke WhatsApp kami supaya pesanan cepat diverifikasi.",
  },
  {
    cat: "Pembayaran",
    q: "Kode QRIS-nya ada di mana?",
    a: "Di halaman pembayaran setelah kamu memilih nominal. Kalau halaman itu tertutup, buka lagi lewat kode invoice di halaman Cek Invoice.",
  },
  {
    cat: "Pembayaran",
    q: "Apakah ada biaya tambahan?",
    a: "QRIS tidak dikenakan biaya tambahan. Untuk produk tagihan dan token, biaya admin sudah termasuk di harga yang tertera.",
  },
  {
    cat: "Pesanan",
    q: "Berapa lama pesanan diproses?",
    a: "Rata-rata sekitar 5 detik setelah pembayaran terkonfirmasi. Saat operator atau server game sedang sibuk, bisa sedikit lebih lama.",
  },
  {
    cat: "Pesanan",
    q: "Salah isi nomor tujuan, bisa dibatalkan?",
    a: "Pesanan yang sudah diteruskan ke provider nggak bisa dibatalkan. Selalu cek ulang nomor atau ID sebelum menekan tombol bayar.",
  },
  {
    cat: "Pesanan",
    q: "Transaksi gagal, dana saya gimana?",
    a: "Transaksi gagal otomatis direfund penuh ke metode pembayaran asal. Simpan kode invoice untuk melacak prosesnya.",
  },
  {
    cat: "Pesanan",
    q: "Di mana kode token PLN ditampilkan?",
    a: "Di detail invoice pada halaman Cek Invoice. Simpan kode invoice-nya biar bisa dibuka kapan saja.",
  },
  {
    cat: "Akun",
    q: "Perlu daftar akun untuk transaksi?",
    a: "Nggak perlu. Semua transaksi bisa tanpa akun, cukup simpan kode invoice.",
  },
  {
    cat: "Akun",
    q: "Riwayat transaksi saya tersimpan di mana?",
    a: "Riwayat tersimpan di browser yang kamu pakai. Buka halaman Cek Invoice untuk melihatnya.",
  },
  {
    cat: "Akun",
    q: "Bagaimana cara cek status pesanan?",
    a: "Masukkan kode invoice di halaman Cek Invoice. Status dan rincian pesanan langsung tampil.",
  },
];

const CATS = ["Semua", "Pembayaran", "Pesanan", "Akun"] as const;

export function BantuanClient() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Semua");
  const [query, setQuery] = useState("");

  const term = query.toLowerCase().trim();
  const list = FAQS.filter((faq) => {
    if (cat !== "Semua" && faq.cat !== cat) return false;
    if (!term) return true;
    return `${faq.q} ${faq.a}`.toLowerCase().includes(term);
  });

  return (
    <main className="wrap">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Bantuan" },
        ]}
      />

      <h1 style={{ fontSize: "clamp(38px,9vw,64px)", fontWeight: 900, marginTop: 20 }}>
        Ada yang bisa dibantu?
      </h1>

      <div style={{ position: "relative", maxWidth: 560, marginTop: 20 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input"
          placeholder="Cari pertanyaan, misal: refund"
          style={{ paddingLeft: 46 }}
          aria-label="Cari pertanyaan"
        />
        <span
          style={{ position: "absolute", left: 14, top: 15, color: "var(--muted)" }}
          aria-hidden="true"
        >
          <Icon name="search" />
        </span>
      </div>

      <div className="lay" style={{ marginTop: 28 }}>
        <div style={{ minWidth: 0 }}>
          <div className="fil">
            {CATS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCat(category)}
                className={cat === category ? "on" : ""}
              >
                {category}
              </button>
            ))}
          </div>

          {list.length ? (
            list.map((faq) => (
              <details key={faq.q} className="fq" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 18, marginBottom: 10, padding: "0 20px", borderBottomWidth: 1 }}>
                <summary>
                  <div>
                    <span className="tg">{faq.cat}</span>
                    <div>{faq.q}</div>
                  </div>
                  <Icon name="plus" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))
          ) : (
            <p className="muted" style={{ padding: "20px 0" }}>
              Nggak ada hasil. Coba kata lain atau hubungi kami.
            </p>
          )}
        </div>

        <aside id="kontak" className="card card-pop ct" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 22 }}>Masih butuh bantuan?</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>
            Tim kami siap 24 jam. Siapkan kode invoice biar cepat.
          </p>
          <a href={WA_LINK} target="_blank" rel="noreferrer">
            <span className="ib">
              <Icon name="chat" />
            </span>
            <div>
              <b>WhatsApp</b>
              <div className="muted" style={{ fontSize: 13 }}>
                {ADMIN_WA}
              </div>
            </div>
          </a>
          <Link href="/invoice">
            <span className="ib">
              <Icon name="receipt" />
            </span>
            <div>
              <b>Cek invoice</b>
              <div className="muted" style={{ fontSize: 13 }}>
                Lihat status pesananmu
              </div>
            </div>
          </Link>
        </aside>
      </div>
    </main>
  );
}
