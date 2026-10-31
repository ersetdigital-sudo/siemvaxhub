import type { IconName } from "./icons";

export type Category = "isi" | "tagihan" | "hiburan";

export type Item = {
  id: string;
  name: string;
  price: number;
  note?: string;
  dbId?: string;
};

export type Service = {
  name: string;
  cat: Category;
  icon: IconName;
  desc: string;
  input: string;
  ph: string;
  phone?: boolean;
  detect?: boolean;
  providers?: Record<string, string>;
  bill?: boolean;
  admin?: number;
  items?: (provider: string) => Item[];
  dbServiceId?: string;
};

export const OPS: Record<string, { name: string; pre: string[]; m: number }> = {
  telkomsel: {
    name: "Telkomsel",
    pre: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"],
    m: 1,
  },
  indosat: {
    name: "Indosat",
    pre: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
    m: 0.99,
  },
  xl: { name: "XL", pre: ["0817", "0818", "0819", "0859", "0877", "0878"], m: 1.01 },
  axis: { name: "Axis", pre: ["0831", "0832", "0833", "0838"], m: 0.985 },
  tri: { name: "Tri", pre: ["0895", "0896", "0897", "0898", "0899"], m: 0.98 },
  smartfren: {
    name: "Smartfren",
    pre: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
    m: 0.99,
  },
};

export const normalizePhone = (value: string) => {
  let digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("62")) digits = "0" + digits.slice(2);
  else if (digits.startsWith("8")) digits = "0" + digits;
  return digits;
};

export const detectOperator = (value: string) => {
  const digits = normalizePhone(value);
  if (digits.length < 4) return null;
  const prefix = digits.slice(0, 4);
  for (const key of Object.keys(OPS)) {
    if (OPS[key].pre.includes(prefix)) return key;
  }
  return null;
};

const round100 = (value: number) => Math.round(value / 100) * 100;

const PULSA_BASE: [number, number][] = [
  [5000, 6200],
  [10000, 11000],
  [20000, 20900],
  [25000, 25800],
  [50000, 50800],
  [100000, 100200],
];

const pulsaItems = (provider: string): Item[] =>
  PULSA_BASE.map(([amount, price]) => ({
    id: `p${amount / 1000}`,
    name: `Pulsa ${amount / 1000}rb`,
    price: provider === "telkomsel" ? price : round100(price * (OPS[provider]?.m || 1)),
  }));

const DATA_BASE: [string, string, number][] = [
  ["d3", "3 GB · 7 hari", 15000],
  ["d8", "8 GB · 30 hari", 35000],
  ["d15", "15 GB · 30 hari", 55000],
  ["d25", "25 GB · 30 hari", 75000],
  ["d50", "50 GB · 30 hari", 110000],
  ["dunl", "Unlimited Harian · 30 hari", 125000],
];

const dataItems = (provider: string): Item[] =>
  DATA_BASE.map(([id, name, price]) => ({
    id,
    name,
    price: round100(price * (OPS[provider]?.m || 1)),
  }));

const nominal = (list: number[], admin: number, prefix = ""): Item[] =>
  list.map((amount) => ({
    id: `n${amount / 1000}`,
    name: `${prefix}${amount / 1000}rb`,
    price: amount + admin,
    note: `termasuk admin ${formatRp(admin)}`,
  }));

const gameItems = (provider: string): Item[] => {
  const map: Record<string, [string, number][]> = {
    ml: [
      ["86 Diamonds", 24500],
      ["172 Diamonds", 48500],
      ["257 Diamonds", 72000],
      ["344 Diamonds", 97000],
      ["706 Diamonds", 198000],
      ["Weekly Diamond Pass", 34900],
    ],
    ff: [
      ["70 Diamonds", 10900],
      ["140 Diamonds", 21500],
      ["355 Diamonds", 51000],
      ["720 Diamonds", 101000],
      ["1450 Diamonds", 196000],
    ],
    pubg: [
      ["60 UC", 17500],
      ["325 UC", 80500],
      ["660 UC", 167000],
    ],
  };
  return (map[provider] || []).map(([name, price], index) => ({
    id: `g${index}`,
    name,
    price,
  }));
};

export const SERVICES: Record<string, Service> = {
  pulsa: {
    name: "Pulsa",
    cat: "isi",
    icon: "phone",
    desc: "Isi pulsa semua operator, langsung masuk dalam hitungan detik.",
    input: "Nomor HP",
    ph: "08xx xxxx xxxx",
    phone: true,
    detect: true,
    items: pulsaItems,
  },
  "paket-data": {
    name: "Paket Data",
    cat: "isi",
    icon: "wifi",
    desc: "Kuota internet harian sampai bulanan, harga bersahabat.",
    input: "Nomor HP",
    ph: "08xx xxxx xxxx",
    phone: true,
    detect: true,
    items: dataItems,
  },
  "e-wallet": {
    name: "E-Wallet",
    cat: "isi",
    icon: "wallet",
    desc: "Top up saldo DANA, OVO, GoPay, ShopeePay, dan LinkAja.",
    input: "Nomor HP terdaftar",
    ph: "08xx xxxx xxxx",
    phone: true,
    providers: {
      dana: "DANA",
      ovo: "OVO",
      gopay: "GoPay",
      shopeepay: "ShopeePay",
      linkaja: "LinkAja",
    },
    items: () => nominal([10000, 20000, 25000, 50000, 100000, 200000], 1500, "Saldo "),
  },
  pln: {
    name: "Token PLN",
    cat: "tagihan",
    icon: "bolt",
    desc: "Token listrik prabayar, kode token langsung dikirim.",
    input: "Nomor meter / ID pelanggan",
    ph: "11 digit nomor meter",
    providers: { pln: "PLN Prabayar" },
    items: () => nominal([20000, 50000, 100000, 200000, 500000], 2500, "Token "),
  },
  pdam: {
    name: "PDAM",
    cat: "tagihan",
    icon: "drop",
    desc: "Bayar tagihan air PDAM di berbagai kota.",
    input: "ID pelanggan PDAM",
    ph: "Contoh 1023456789",
    providers: {
      jkt: "PAM Jaya",
      sby: "PDAM Surabaya",
      bdg: "PDAM Bandung",
      smg: "PDAM Semarang",
    },
    bill: true,
    admin: 2500,
  },
  "tv-internet": {
    name: "TV & Internet",
    cat: "tagihan",
    icon: "tv",
    desc: "Tagihan IndiHome, First Media, Biznet, dan MyRepublic.",
    input: "Nomor pelanggan",
    ph: "Nomor pelanggan",
    providers: {
      indihome: "IndiHome",
      firstmedia: "First Media",
      biznet: "Biznet",
      myrep: "MyRepublic",
    },
    bill: true,
    admin: 2500,
  },
  game: {
    name: "Voucher Game",
    cat: "hiburan",
    icon: "game",
    desc: "Diamond, UC, dan top up game favoritmu.",
    input: "User ID (Zone ID)",
    ph: "Contoh 12345678 (1234)",
    providers: {
      ml: "Mobile Legends",
      ff: "Free Fire",
      pubg: "PUBG Mobile",
    },
    items: gameItems,
  },
  bpjs: {
    name: "BPJS Kesehatan",
    cat: "tagihan",
    icon: "shield",
    desc: "Iuran BPJS Kesehatan per kelas, bisa bayar beberapa bulan.",
    input: "Nomor VA keluarga",
    ph: "88888 xxxx xxxx",
    providers: { k1: "Kelas 1", k2: "Kelas 2", k3: "Kelas 3" },
    items: (provider) => {
      const fee = { k1: 150000, k2: 100000, k3: 35000 }[provider] || 0;
      return [1, 2, 3, 6].map((months) => ({
        id: `b${months}`,
        name: `${months} bulan`,
        price: fee * months + 2500,
        note: "termasuk admin Rp2.500",
      }));
    },
  },
  multifinance: {
    name: "Multifinance",
    cat: "tagihan",
    icon: "car",
    desc: "Cicilan motor & mobil: Adira, FIF, BAF, WOM.",
    input: "Nomor kontrak",
    ph: "Nomor kontrak",
    providers: {
      adira: "Adira Finance",
      fif: "FIF Group",
      baf: "BAF",
      wom: "WOM Finance",
    },
    bill: true,
    admin: 3500,
  },
};

export const SERVICE_ORDER = [
  "pulsa",
  "paket-data",
  "e-wallet",
  "pln",
  "game",
  "pdam",
  "tv-internet",
  "bpjs",
  "multifinance",
];

export const CATEGORIES: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "isi", label: "Isi ulang" },
  { key: "tagihan", label: "Tagihan" },
  { key: "hiburan", label: "Hiburan" },
];

export const isSlug = (value: string | null | undefined): boolean =>
  !!value && value in SERVICES;

export const formatRp = (value: number) =>
  "Rp" + Math.round(value).toLocaleString("id-ID");

export const minPrice = (slug: string) => {
  const service = SERVICES[slug];
  if (service.bill || !service.items) return null;
  const provider = service.detect ? "telkomsel" : Object.keys(service.providers || {})[0] || "";
  const list = service.items(provider);
  return list.length ? Math.min(...list.map((item) => item.price)) : null;
};
