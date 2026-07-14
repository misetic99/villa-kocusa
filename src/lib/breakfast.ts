import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { BreakfastPrice } from "./types";

// A single flat rate that applies to every room — no per-room or per-month variation.
export const DEFAULT_BREAKFAST_PRICE: BreakfastPrice = { price: 10 };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "breakfast-price.json");

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(DEFAULT_BREAKFAST_PRICE, null, 2) + "\n", "utf-8");
  }
}

export async function getBreakfastPrice(): Promise<BreakfastPrice> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Partial<BreakfastPrice>;
    return typeof parsed.price === "number" ? { price: parsed.price } : DEFAULT_BREAKFAST_PRICE;
  } catch {
    return DEFAULT_BREAKFAST_PRICE;
  }
}

export async function setBreakfastPrice(price: number): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify({ price }, null, 2) + "\n", "utf-8");
}
