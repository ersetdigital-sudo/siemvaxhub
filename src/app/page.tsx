import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { Icon } from "@/components/Icon";
import { ServicesBento } from "@/components/ServicesBento";

const TRANSACTIONS = [
  ["0812****21", "Pulsa 50rb"],
  ["ID 8823****", "86 Diamonds ML"],
  ["0857****09", "Paket 15 GB"],
  ["Meter 5412****", "Token PLN 100rb"],
  ["0896****77", "Pulsa 20rb"],
  ["DANA 0813****", "Saldo 100rb"],
  ["UID 2213****", "140 Diamonds FF"],
  ["VA 8888****", "BPJS Kelas 3"],
  ["0878****45", "Paket 25 GB"],
  ["GoPay 0821****", "Saldo 50rb"],
];

const FAQS = [
  {
    q: "Harus daftar akun dulu?",
    a: "Nggak. Cukup isi nomor tujuan dan bayar. Simpan kode invoice kalau mau cek status nanti.",
  },
  {
    q: "Berapa lama pesanan diproses?",
    a: "Rata-rata sekitar 5 detik setelah pembayaran terkonfirmasi. Saat gangguan operator bisa sedikit lebih lama.",
  },
  {
    q: "Kalau transaksi gagal gimana?",
    a: "Dana dikembalikan penuh. Hubungi kami dengan kode invoice, tim kami bantu cek.",
  },
  {
    q: "Metode bayar apa saja?",
    a: "Semua pesanan dibayar lewat QRIS. Satu kode bisa discan dari aplikasi bank atau e-wallet apa pun, tanpa biaya tambahan.",
  },
];

function MarqueeRow() {
  return (
    <>
      {TRANSACTIONS.map(([target, item], index) => (
        <div key={`${target}-${index}`}>
          <i />
          <b>{item}</b>
          <span className="muted">
            {target} · {(index % 5) + 1} menit lalu
          </span>
          <span style={{ color: "var(--red)", fontWeight: 600 }}>Berhasil</span>
        </div>
      ))}
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="board">
            <div className="deco d1" />
            <div className="deco d2" />
            <div className="deco d3" />
            <HomeHero />
          </div>
        </div>
      </section>

      <div className="mq" aria-label="Transaksi terbaru">
        <div className="mq-t">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>

      <section className="sec" id="layanan">
        <div className="wrap">
          <h2 className="h2 reveal">Hari ini mau beresin apa?</h2>
          <ServicesBento />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 reveal">Tiga langkah. Udah, itu doang.</h2>
          <div className="steps">
            <div className="card stp reveal">
              <div className="num">01</div>
              <h3>Pilih produk</h3>
              <p className="muted">
                Ketik nomor atau ID, pilih nominal. Operator dan tagihan kami cek
                otomatis.
              </p>
            </div>
            <div className="card stp reveal">
              <div className="num">02</div>
              <h3>Scan QRIS</h3>
              <p className="muted">
                Satu kode untuk semua bank dan e-wallet. Bayar dari aplikasi yang
                paling dekat di tangan.
              </p>
            </div>
            <div className="card card-pop stp reveal">
              <div className="num" style={{ color: "var(--red)" }}>
                03
              </div>
              <h3>Langsung masuk</h3>
              <p className="muted">
                Rata-rata 5 detik dan beres. Kalau gagal, dana balik utuh tanpa
                drama.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap faq-grid">
          <div>
            <h2 className="h2 reveal">Pertanyaan yang pasti kepikiran</h2>
            <p className="muted" style={{ margin: "12px 0 20px" }}>
              Jawabannya singkat. Kalau masih ganjel, pusat bantuan siap.
            </p>
            <Link href="/bantuan" className="btn btn-ghost">
              Buka pusat bantuan
            </Link>
          </div>
          <div>
            {FAQS.map((faq) => (
              <details key={faq.q} className="fq">
                <summary>
                  {faq.q}
                  <Icon name="plus" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
