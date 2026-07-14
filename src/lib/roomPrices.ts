import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getRoomById, rooms } from "./rooms";
import type { MonthlyPrice, RoomPriceSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "room-prices.json");

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, "{}\n", "utf-8");
  }
}

export async function readRoomPriceSettings(): Promise<RoomPriceSettings> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as RoomPriceSettings;
  } catch {
    return {};
  }
}

async function writeRoomPriceSettings(settings: RoomPriceSettings) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(settings, null, 2) + "\n", "utf-8");
}

// Falls back to the room's static pricePerNight/discountedPricePerNight
// (src/lib/rooms.ts) until an admin customizes a given month.
function defaultForRoom(roomId: string): MonthlyPrice {
  const room = getRoomById(roomId);
  return {
    price: room?.pricePerNight ?? 0,
    discountedPrice: room?.discountedPricePerNight ?? 0,
  };
}

export function getRoomPriceFor(
  settings: RoomPriceSettings,
  roomId: string,
  month: number
): MonthlyPrice {
  return settings[roomId]?.[String(month)] ?? defaultForRoom(roomId);
}

export async function getFullRoomPriceTable(): Promise<
  Record<string, Record<string, MonthlyPrice>>
> {
  const settings = await readRoomPriceSettings();
  const table: Record<string, Record<string, MonthlyPrice>> = {};
  for (const room of rooms) {
    table[room.id] = {};
    for (let month = 1; month <= 12; month++) {
      table[room.id][String(month)] = getRoomPriceFor(settings, room.id, month);
    }
  }
  return table;
}

export async function setRoomPrice(
  roomId: string,
  month: number,
  price: number,
  discountedPrice: number
): Promise<void> {
  const settings = await readRoomPriceSettings();
  if (!settings[roomId]) settings[roomId] = {};
  settings[roomId][String(month)] = { price, discountedPrice };
  await writeRoomPriceSettings(settings);
}
