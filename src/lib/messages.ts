import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf-8");
  }
}

export async function readMessages(): Promise<ContactMessage[]> {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function createMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<ContactMessage> {
  const entry: ContactMessage = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  const all = await readMessages();
  all.push(entry);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(all, null, 2) + "\n", "utf-8");

  return entry;
}
