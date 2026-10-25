export const ORDERS_KEY = "siemvaxhub_orders";
export const QRIS_IMAGE =
  "https://res.cloudinary.com/dqjh7utdb/image/upload/v1792161327/camhvfeu1lcm0ps8ieiz.jpg";
export const ADMIN_WA = "085711172317";
export const WA_LINK = "https://wa.me/6285711172317";
export const PAID_MESSAGE = "Terima kasih, pembayaran Anda sedang diproses";

export type Order = {
  id: string;
  slug: string;
  service: string;
  provider: string;
  item: string;
  target: string;
  amount: number;
  method: "QRIS";
  status: "processing";
  createdAt: number;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const newOrderId = () =>
  "SVH-" +
  Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

export const loadOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order): void => {
  if (typeof window === "undefined") return;
  try {
    const all = loadOrders();
    all.unshift(order);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(0, 30)));
  } catch {
    /* storage unavailable */
  }
};

export const findOrder = (id: string): Order | undefined => {
  const key = id.trim().toUpperCase();
  return loadOrders().find((order) => order.id === key);
};

export const waLink = (message: string) => `${WA_LINK}?text=${encodeURIComponent(message)}`;

export const formatDateTime = (value: number) =>
  new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (value: number) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatTime = (value: number) =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
