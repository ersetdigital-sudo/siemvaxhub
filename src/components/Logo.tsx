import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Siemvaxhub beranda">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#006732" />
        <path
          d="M26 14A6 6 0 1 0 20 20"
          fill="none"
          stroke="#F7F6E8"
          strokeWidth="5"
        />
        <path
          d="M20 20A6 6 0 1 1 14 26"
          fill="none"
          stroke="#FE7A25"
          strokeWidth="5"
        />
      </svg>
      <span style={{ letterSpacing: "-.04em" }}>
        siemvax<span style={{ color: "#006732" }}>hub</span>
      </span>
    </Link>
  );
}
