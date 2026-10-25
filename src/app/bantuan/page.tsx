import type { Metadata } from "next";
import { BantuanClient } from "@/components/BantuanClient";

export const metadata: Metadata = {
  title: "Bantuan",
};

export default function BantuanPage() {
  return <BantuanClient />;
}
