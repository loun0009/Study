import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});

let connected = false;

export async function getDb() {
  if (!connected) {
    await db.connect();
    connected = true;
  }
  return db;
}