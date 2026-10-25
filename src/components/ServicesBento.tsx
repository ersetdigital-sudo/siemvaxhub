"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import {
  CATEGORIES,
  SERVICES,
  SERVICE_ORDER,
  type Category,
} from "@/lib/catalog";

export function ServicesBento() {
  const [filter, setFilter] = useState<"all" | Category>("all");

  const list = SERVICE_ORDER.filter(
    (slug) => filter === "all" || SERVICES[slug].cat === filter,
  );

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Filter layanan">
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            type="button"
            className={filter === category.key ? "on" : ""}
            onClick={() => setFilter(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="bento">
        {list.map((slug) => {
          const service = SERVICES[slug];
          const big = slug === "pulsa";
          return (
            <Link
              key={slug}
              href={`/produk?s=${slug}`}
              className={`card svc ${big ? "big" : ""}`}
            >
              <span className="ib">
                <Icon name={service.icon} />
              </span>
              <div>
                <h3>{service.name}</h3>
                <p>
                  {big
                    ? service.desc
                    : service.desc.split(",")[0].split(".")[0]}
                </p>
                {big && (
                  <span
                    className="btn"
                    style={{
                      background: "var(--bg)",
                      color: "var(--red)",
                      marginTop: 18,
                      minHeight: 44,
                    }}
                  >
                    Isi pulsa <Icon name="arrow" className="h-4 w-4" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
