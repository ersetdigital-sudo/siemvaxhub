"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Beranda", key: "home" },
  { href: "/produk", label: "Produk", key: "produk" },
  { href: "/invoice", label: "Cek Invoice", key: "invoice" },
  { href: "/bantuan", label: "Bantuan", key: "bantuan" },
];

const normalize = (value: string) => value.replace(/\/+$/, "") || "/";

export function SiteHeader() {
  const pathname = normalize(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const active = pathname.startsWith("/produk") || pathname.startsWith("/bayar")
    ? "produk"
    : pathname.startsWith("/invoice")
      ? "invoice"
      : pathname.startsWith("/bantuan")
        ? "bantuan"
        : "home";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap hdr-in">
        <Logo />
        <nav className="nav" aria-label="Menu utama">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={active === link.key ? "on" : ""}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/produk?s=pulsa" className="btn btn-red hdr-cta">
          Top up
        </Link>
        <button
          type="button"
          className="burger"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>

        {open && (
          <div className="mnav">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`lk ${active === link.key ? "on" : ""}`}
              >
                {link.label} <Icon name="arrow" className="h-5 w-5" />
              </Link>
            ))}
            <Link href="/produk?s=pulsa" className="btn btn-red">
              Top up sekarang
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
