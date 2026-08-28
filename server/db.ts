import type { InsertUser, User } from "../drizzle/schema";
import { ENV } from './_core/env';

const usersStore: User[] = [];
let nextUserId = 1;

export async function getDb() {
  return {}; // Dummy return so nothing relying on getDb truthiness crashes
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  let existing = usersStore.find(u => u.openId === user.openId);
  
  if (existing) {
    if (user.name !== undefined) existing.name = user.name ?? null;
    if (user.email !== undefined) existing.email = user.email ?? null;
    if (user.loginMethod !== undefined) existing.loginMethod = user.loginMethod ?? null;
    if (user.lastSignedIn !== undefined) existing.lastSignedIn = user.lastSignedIn ?? new Date();
    if (user.role !== undefined) existing.role = user.role ?? "user";
    existing.updatedAt = new Date();
  } else {
    usersStore.push({
      id: nextUserId++,
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      role: user.role ?? (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: user.lastSignedIn ?? new Date()
    });
  }
}

export async function getUserByOpenId(openId: string) {
  return usersStore.find(u => u.openId === openId);
}
