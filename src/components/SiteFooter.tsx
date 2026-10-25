import Link from "next/link";
import { SERVICES } from "@/lib/catalog";
import { Logo } from "./Logo";

const PRODUCT_LINKS = ["pulsa", "paket-data", "e-wallet", "pln", "game", "bpjs"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <Logo />
            <p className="muted mt-3 max-w-[300px] text-sm">
              Top up pulsa, data, game, dan bayar tagihan tanpa ribet. Online 24
              jam, tanpa wajib daftar akun.
            </p>
          </div>
          <div>
            <h4>Produk</h4>
            <ul>
              {PRODUCT_LINKS.map((slug) => (
                <li key={slug}>
                  <Link href={`/produk?s=${slug}`}>{SERVICES[slug].name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Bantuan</h4>
            <ul>
              <li>
                <Link href="/bantuan">Pusat bantuan</Link>
              </li>
              <li>
                <Link href="/invoice">Cek invoice</Link>
              </li>
              <li>
                <Link href="/bantuan#kontak">Hubungi kami</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="ftr-bot">
          <span>© {year} Siemvaxhub. Semua hak dilindungi.</span>
          <span>Dibuat santai, diproses serius.</span>
        </div>
      </div>
    </footer>
  );
}
