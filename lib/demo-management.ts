"use client";

import {useEffect, useState} from "react";
import {looks, productCategories, type Look, type Size} from "@/lib/catalog";

const PRODUCTS_KEY = "grazzi-demo-catalog-v1";
const ORDERS_KEY = "grazzi-demo-orders-v1";
const CHANGE_EVENT = "grazzi-demo-change";

export type DemoOrder = {
  id: string;
  createdAt: string;
  customer: string;
  items: {slug: string; title: string; size: Size; quantity: number}[];
  fulfillment: "retirada" | "entrega";
  payment: "pix" | "debito" | "credito";
  totalCents: number;
  status: "Novo" | "Em separação" | "Concluído" | "Cancelado";
};

const safeParse = (key: string): unknown => {
  if (typeof window === "undefined") return null;
  try {return JSON.parse(localStorage.getItem(key) || "null");} catch {return null;}
};

const validImage = (image: unknown) =>
  typeof image === "string" && looks.some((look) => look.image === image);

const cleanLook = (raw: unknown): Look | null => {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<Look>;
  if (typeof row.slug !== "string" || !/^[a-z0-9-]{1,80}$/.test(row.slug) ||
      typeof row.title !== "string" || !row.title.trim() || row.title.length > 100 ||
      !productCategories.includes(row.category as Look["category"]) ||
      !validImage(row.image) || typeof row.note !== "string" || row.note.length > 300 ||
      !Number.isInteger(row.demoPriceCents) || (row.demoPriceCents ?? 0) < 0 || (row.demoPriceCents ?? 0) > 10000000 ||
      !Number.isInteger(row.demoStock) || (row.demoStock ?? 0) < 0 || (row.demoStock ?? 0) > 100000) return null;
  return {
    slug: row.slug, title: row.title.trim(), category: row.category as Look["category"],
    image: row.image as string, alt: row.title.trim(), note: row.note.trim(),
    demoPriceCents: row.demoPriceCents as number, demoStock: row.demoStock as number,
  };
};

export function getDemoLooks(): Look[] {
  const stored = safeParse(PRODUCTS_KEY);
  if (!Array.isArray(stored)) return looks;
  const entries = stored.map(cleanLook).filter((look): look is Look => Boolean(look));
  const bySlug = new Map(entries.map((look) => [look.slug, look]));
  const base = looks.map((look) => bySlug.get(look.slug) || look);
  const extras = entries.filter((look) => look.slug.startsWith("local-") && !looks.some((baseLook) => baseLook.slug === look.slug));
  return [...base, ...extras];
}

export function getDemoLook(slug: string) {return getDemoLooks().find((look) => look.slug === slug);}

const announceChange = () => window.dispatchEvent(new Event(CHANGE_EVENT));

export function saveDemoLook(look: Look) {
  const clean = cleanLook(look);
  if (!clean) return false;
  const current = getDemoLooks();
  const next = current.some((item) => item.slug === clean.slug)
    ? current.map((item) => item.slug === clean.slug ? clean : item)
    : [...current, clean];
  try {localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next)); announceChange(); return true;} catch {return false;}
}

export function removeDemoLook(slug: string) {
  if (!slug.startsWith("local-")) return false;
  try {localStorage.setItem(PRODUCTS_KEY, JSON.stringify(getDemoLooks().filter((look) => look.slug !== slug))); announceChange(); return true;} catch {return false;}
}

export function useDemoLooks() {
  const [catalog, setCatalog] = useState<Look[]>(looks);
  useEffect(() => {
    const sync = () => setCatalog(getDemoLooks());
    sync(); window.addEventListener(CHANGE_EVENT, sync); window.addEventListener("storage", sync);
    return () => {window.removeEventListener(CHANGE_EVENT, sync); window.removeEventListener("storage", sync);};
  }, []);
  return catalog;
}

export function getDemoOrders(): DemoOrder[] {
  const stored = safeParse(ORDERS_KEY);
  if (!Array.isArray(stored)) return [];
  return stored.filter((row) => row && typeof row.id === "string" && Array.isArray(row.items) && typeof row.totalCents === "number") as DemoOrder[];
}

export function addDemoOrder(order: DemoOrder) {
  try {localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...getDemoOrders()].slice(0, 100))); announceChange(); return true;} catch {return false;}
}

export function updateDemoOrderStatus(id: string, status: DemoOrder["status"]) {
  if (!["Novo", "Em separação", "Concluído", "Cancelado"].includes(status)) return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(getDemoOrders().map((order) => order.id === id ? {...order, status} : order)));
  announceChange();
}

export function useDemoOrders() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  useEffect(() => {
    const sync = () => setOrders(getDemoOrders());
    sync(); window.addEventListener(CHANGE_EVENT, sync); window.addEventListener("storage", sync);
    return () => {window.removeEventListener(CHANGE_EVENT, sync); window.removeEventListener("storage", sync);};
  }, []);
  return orders;
}
