"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import {
  detectOperator,
  formatRp,
  normalizePhone,
  OPS,
  SERVICES,
  SERVICE_ORDER,
  type Item,
} from "@/lib/catalog";
import type { HydratedService } from "@/lib/catalog-hydrate";
import { createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { rememberInvoice } from "@/lib/store";

export function ProdukClient({
  service,
  slug,
  brandSlug,
  qrisMethodId,
}: {
  service: HydratedService;
  slug: string;
  brandSlug: string;
  qrisMethodId: string | null;
}) {
  const router = useRouter();
  const providerKeys = service.detect
    ? Object.keys(OPS)
    : Object.keys(service.providers ?? {});
  const hasProviders = providerKeys.length > 0;

  const [target, setTarget] = useState("");
  const [provider, setProvider] = useState<string | null>(
    providerKeys.length === 1 ? providerKeys[0] : null,
  );
  const [itemId, setItemId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const operator = service.detect ? detectOperator(target) : null;
  const activeProvider = service.detect ? operator : provider;
  const providerName = service.detect
    ? operator
      ? OPS[operator].name
      : ""
    : provider
      ? service.providers?.[provider] || ""
      : "";

  const phoneLike = !!service.phone;
  const digits = target.replace(/\D/g, "");
  const targetOk = phoneLike
    ? normalizePhone(target).length >= 10
    : digits.length >= 6;
  const providerOk = service.detect ? !!operator : hasProviders ? !!provider : true;

  const bill: Item | null =
    service.bill && targetOk && provider ? service.billItem : null;

  const items: Item[] = (() => {
    if (service.bill) return bill ? [bill] : [];
    if (!activeProvider) return [];
    return service.itemGroups[activeProvider] ?? [];
  })();

  const item = service.bill ? items[0] : items.find((entry) => entry.id === itemId);
  const ready = targetOk && providerOk && !!item;

  const setTargetValue = (value: string) => {
    setTarget(value);
    if (service.detect) {
      const nextOperator = detectOperator(value);
      if (nextOperator !== operator) setItemId(null);
    }
    if (service.bill) setItemId(null);
  };

  const chooseProvider = (key: string) => {
    setProvider(key);
    setItemId(null);
  };

  const go = async () => {
    if (!ready || !item || paying) return;
    if (!service.dbServiceId || !item.dbId) {
      setPayError("Data produk belum lengkap. Muat ulang halaman.");
      return;
    }
    if (!brandSlug || !qrisMethodId) {
      setPayError("Pembayaran belum tersedia. Coba lagi sebentar.");
      return;
    }

    const targetValue = phoneLike ? normalizePhone(target) : target.trim();
    setPaying(true);
    setPayError("");
    try {
      const created = await createOrder({
        brandSlug,
        serviceId: service.dbServiceId,
        productId: item.dbId,
        nomorTujuan: targetValue,
        input: {
          provider: providerName || "-",
          item: item.name,
          nomor_tujuan: targetValue,
        },
        paymentMethodId: qrisMethodId,
      });
      rememberInvoice({
        ref: created.ref,
        service: service.name,
        item: item.name,
        target: targetValue,
        slug,
        amount: created.total,
        createdAt: Date.now(),
      });
      router.push(`/bayar?id=${created.ref}`);
    } catch (error) {
      setPayError(toPublicError(error).message);
      setPaying(false);
    }
  };

  const helper = service.detect
    ? operator
      ? `Operator terdeteksi: ${OPS[operator].name}.`
      : "Operator terdeteksi otomatis dari 4 digit awal."
    : service.bill
      ? "Nominal tagihan dari katalog, dicek admin."
      : hasProviders && service.phone
        ? "Pilih e-wallet dulu, lalu masukkan nomor yang terdaftar."
        : service.cat === "hiburan"
          ? "Pastikan User ID dan Zone ID sudah benar."
          : "Pastikan data tujuan sudah benar.";

  const itemsStep = hasProviders ? 3 : 2;
  const hint = payError
    ? `⚠ ${payError}`
    : !targetOk
      ? `Isi ${service.input.toLowerCase()} dulu`
      : !providerOk
        ? hasProviders && service.phone
          ? "Pilih e-wallet dulu"
          : "Pilih provider dulu"
        : !item
          ? "Pilih nominal dulu"
          : item.name;

  return (
    <>
      <main className="wrap pad-bar no-foot">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Produk", href: "/produk" },
            { label: service.name },
          ]}
        />

        <div className="cats">
          {SERVICE_ORDER.map((key) => (
            <Link
              key={key}
              href={`/produk?s=${key}`}
              className={key === slug ? "on" : ""}
            >
              {SERVICES[key].name}
            </Link>
          ))}
        </div>

        <section className="banner">
          <span className="bi">
            <Icon name={service.icon} />
          </span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--orange)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {service.cat === "isi"
                ? "Isi ulang"
                : service.cat === "tagihan"
                  ? "Tagihan"
                  : "Hiburan"}
            </div>
            <h1>{service.name}</h1>
            <p style={{ margin: "10px 0 16px" }}>{service.desc}</p>
            <div className="bchips">
              <span>⚡ Proses ±5 detik</span>
              <span>↺ Gagal = refund</span>
              <span>Buka 24 jam</span>
            </div>
          </div>
        </section>

        <div className="lay">
          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "minmax(0, 1fr)",
            }}
          >
            <div className={`card step ${targetOk ? "done" : ""}`}>
              <div className="step-h">
                <span className="step-n">1</span>
                <h3>{service.input}</h3>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  value={target}
                  onChange={(event) => setTargetValue(event.target.value)}
                  className="input"
                  placeholder={service.ph}
                  autoComplete="off"
                  inputMode={phoneLike ? "numeric" : "text"}
                  aria-label={service.input}
                />
                {service.detect && operator && (
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "var(--soft)",
                      color: "var(--red)",
                    }}
                  >
                    {OPS[operator].name}
                  </span>
                )}
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                {helper}
              </p>
            </div>

            {hasProviders && (
              <div className={`card step ${providerOk ? "done" : ""}`}>
                <div className="step-h">
                  <span className="step-n">2</span>
                  <h3>{service.phone ? "Pilih e-wallet" : "Pilih provider"}</h3>
                </div>
                <div className="chips">
                  {providerKeys.map((key) => {
                    const name = service.providers?.[key] || key;
                    const initials = name
                      .replace(/[^A-Za-z0-9 ]/g, "")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => chooseProvider(key)}
                        className={`chip ${provider === key ? "on" : ""}`}
                      >
                        <span className="av">{initials}</span>
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`card step ${item ? "done" : ""}`}>
              <div className="step-h">
                <span className="step-n">{itemsStep}</span>
                <h3>{service.bill ? "Detail tagihan" : "Pilih nominal"}</h3>
              </div>

              {service.bill ? (
                items.length && bill ? (
                  <>
                    <div className="bill">
                      <div>
                        <span className="muted">Produk</span>
                        <b>{bill.name}</b>
                      </div>
                      <div>
                        <span className="muted">Provider</span>
                        <b>{providerName || "-"}</b>
                      </div>
                      <div>
                        <span className="muted">Tujuan</span>
                        <b>{target.trim()}</b>
                      </div>
                      <div
                        style={{
                          borderTop: "1px dashed var(--line)",
                          paddingTop: 8,
                        }}
                      >
                        <span>Total</span>
                        <b className="red">{formatRp(item?.price || 0)}</b>
                      </div>
                    </div>
                    <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                      Nominal dari katalog. Dicek admin sebelum diproses.
                    </p>
                  </>
                ) : (
                  <p className="muted" style={{ fontSize: 14 }}>
                    Isi ID pelanggan dulu, tagihan akan dicek otomatis.
                  </p>
                )
              ) : items.length ? (
                <div className="ogrid">
                  {items.map((entry, index) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setItemId(entry.id)}
                      className={`opt ${item?.id === entry.id ? "on" : ""}`}
                    >
                      {index === 2 && <span className="pop">Populer</span>}
                      <span className="ck">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <div className="n">{entry.name}</div>
                      <div className="p">{formatRp(entry.price)}</div>
                      {entry.note && (
                        <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                          {entry.note}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="muted" style={{ fontSize: 14 }}>
                  {service.detect
                    ? "Masukkan nomor HP dulu, nominal muncul sesuai operator."
                    : service.phone
                      ? "Pilih e-wallet dulu untuk melihat nominal."
                      : "Pilih provider dulu untuk melihat nominal."}
                </p>
              )}
            </div>
          </div>

          <aside className="card card-pop sum">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Ringkasan</h3>
            <dl>
              <div>
                <dt>Produk</dt>
                <dd>{service.name}</dd>
              </div>
              <div>
                <dt>Provider</dt>
                <dd>{providerName || "-"}</dd>
              </div>
              <div>
                <dt>Item</dt>
                <dd>{item?.name || "-"}</dd>
              </div>
              <div>
                <dt>Tujuan</dt>
                <dd>{target.trim() || "-"}</dd>
              </div>
            </dl>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                margin: "16px 0",
              }}
            >
              <span className="muted">Total</span>
              <b className="fh red" style={{ fontSize: 28 }}>
                {item ? formatRp(item.price) : "Rp0"}
              </b>
            </div>
            <button
              type="button"
              className="btn btn-red"
              style={{ width: "100%" }}
              disabled={!ready || paying}
              onClick={() => void go()}
            >
              {paying ? "Memproses…" : "Lanjut bayar"}
            </button>
            {payError ? (
              <p
                className="muted"
                style={{ fontSize: 12, marginTop: 8, color: "var(--orange)" }}
              >
                {payError}
              </p>
            ) : null}
          </aside>
        </div>
      </main>

      <div className="fbar">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="st">{hint}</div>
          <div className="tt">{item ? formatRp(item.price) : "Rp0"}</div>
        </div>
        <button
          type="button"
          className="btn btn-red"
          disabled={!ready || paying}
          onClick={() => void go()}
        >
          {paying ? "…" : "Bayar"}
        </button>
      </div>
    </>
  );
}
