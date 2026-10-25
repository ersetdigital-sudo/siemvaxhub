"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { SERVICES } from "@/lib/catalog";

const WORDS = ["ribet.", "antre.", "drama.", "lama."];

const QUICK = ["paket-data", "e-wallet", "pln", "game"];

const VALUES = [
  {
    icon: "⚡",
    title: "±5 detik, beres.",
    body: "Bayar, kedip, saldo masuk. Diproses otomatis, nggak nunggu admin.",
    pop: true,
  },
  {
    icon: "↺",
    title: "Gagal? Dana balik utuh.",
    body: "Transaksi gagal otomatis direfund. Tanpa drama, tanpa formulir.",
    pop: false,
  },
  {
    icon: "✦",
    title: "Tanpa akun, tanpa OTP.",
    body: "Cukup nomor tujuan. Simpan kode invoice, selesai.",
    pop: false,
  },
];

export function HomeHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [turning, setTurning] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(9);
      return;
    }

    const countTimer = window.setInterval(() => {
      setCount((value) => {
        if (value >= 9) {
          window.clearInterval(countTimer);
          return value;
        }
        return value + 1;
      });
    }, 110);

    let swap: number | undefined;
    const wordTimer = window.setInterval(() => {
      setTurning(true);
      swap = window.setTimeout(() => {
        setWordIndex((value) => (value + 1) % WORDS.length);
        setTurning(false);
      }, 550);
    }, 2400);

    return () => {
      window.clearInterval(countTimer);
      window.clearInterval(wordTimer);
      if (swap) window.clearTimeout(swap);
    };
  }, []);

  const nextWord = (wordIndex + 1) % WORDS.length;

  return (
    <div className="hero-g">
      <div>
        <span className="kick">
          <i className="dot" /> Online 24 jam, termasuk jam 2 pagi
        </span>
        <h1 className="h1">
          {["Isi", "ulang", "semuanya,"].map((word, index) => (
            <Fragment key={word}>
              <span
                className="w"
                style={{ animationDelay: `${index * 0.09}s` }}
              >
                {word}
              </span>{" "}
            </Fragment>
          ))}
          <br />
          <span className="w" style={{ animationDelay: "0.27s" }}>
            tanpa
          </span>{" "}
          <span className="w" style={{ animationDelay: "0.36s" }}>
            <span className={`rot ${turning ? "turning" : ""}`}>
              <span className="cur">{WORDS[wordIndex]}</span>
              <span className="nxt">{WORDS[nextWord]}</span>
            </span>
          </span>
        </h1>
        <p className="lead">
          Pulsa habis pas lagi penting? Kuota sekarat di tengah meeting? Beresin
          di sini dalam ±5 detik. Nggak perlu daftar, nggak perlu nunggu admin
          bales.
        </p>
        <div className="ctas">
          <Link href="/produk?s=pulsa" className="btn bcta">
            Mulai top up <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <a href="#layanan" className="btn bghost">
            Lihat semua layanan
          </a>
        </div>
        <div className="qchips">
          {QUICK.map((slug) => (
            <Link key={slug} href={`/produk?s=${slug}`}>
              <Icon name={SERVICES[slug].icon} />
              {SERVICES[slug].name}
            </Link>
          ))}
        </div>
        <div className="stats">
          <div>
            <b>{count}</b>
            <span>kategori produk</span>
          </div>
          <div>
            <b>±5s</b>
            <span>rata-rata proses</span>
          </div>
          <div>
            <b>0</b>
            <span>akun wajib</span>
          </div>
        </div>
      </div>

      <div className="ordw">
        <div className="sticker">
          Gagal?
          <br />
          Refund!
        </div>
        <div className="vals">
          {VALUES.map((value) => (
            <div key={value.title} className={`val ${value.pop ? "card-pop" : ""}`}>
              <span className="vi">{value.icon}</span>
              <div>
                <b>{value.title}</b>
                <p>{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
