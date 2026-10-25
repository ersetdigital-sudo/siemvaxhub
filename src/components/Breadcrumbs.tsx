import Link from "next/link";
import { Fragment } from "react";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <span aria-hidden="true" className="opacity-50">
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="cur" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
