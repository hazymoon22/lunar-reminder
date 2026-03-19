import { eq, inArray } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { db } from "../db/index.ts";
import { alert, reminder } from "../db/schemas/app.ts";
import { user } from "../db/schemas/auth.ts";
import { auth } from "../lib/auth.ts";
import {
  createAlertSeed,
  createReminderSeed,
  createUserSeed,
  mockSession,
} from "../lib/testing.ts";
import app from "./index.ts";

const seededUserIds: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  if (seededUserIds.length === 0) return;

  const ids = seededUserIds.splice(0, seededUserIds.length);
  await db.delete(user).where(inArray(user.id, ids));
});

describe("server API integration", () => {
  it("POST /api/reminders returns 401 when no session", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(null as never);

    const response = await app.fetch(
      new Request("http://localhost/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("POST /api/reminders creates reminder row", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const payload = {
      title: "Integration reminder",
      reminderDate: "2026-10-10",
      repeat: null,
      alertBefore: 1,
      mailSubject: "Reminder subject",
      mailBody: "<p>Hello</p>",
    };
    const response = await app.fetch(
      new Request("http://localhost/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBeTruthy();

    const [stored] = await db.select().from(reminder).where(eq(reminder.id, body.id)).limit(1);

    expect(stored?.id).toBe(body.id);
    expect(stored?.userId).toBe(seededUser.id);
    expect(stored?.title).toBe(payload.title);
  });

  it("POST /api/reminders returns 400 for invalid payload", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const response = await app.fetch(
      new Request("http://localhost/api/reminders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Bad payload",
          reminderDate: "not-a-date",
          mailSubject: "x",
          mailBody: "<p>x</p>",
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("PATCH /api/reminders/:id updates owned reminder", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    const seededReminder = createReminderSeed(seededUser.id);
    await db.insert(reminder).values(seededReminder);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/reminders/${seededReminder.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated title" }),
      }),
    );

    expect(response.status).toBe(200);

    const [stored] = await db
      .select()
      .from(reminder)
      .where(eq(reminder.id, seededReminder.id))
      .limit(1);
    expect(stored?.title).toBe("Updated title");
  });

  it("PATCH /api/reminders/:id returns 404 for other user's reminder", async () => {
    const owner = createUserSeed();
    const otherUser = createUserSeed();
    seededUserIds.push(owner.id, otherUser.id);
    await db.insert(user).values([owner, otherUser]);

    const seededReminder = createReminderSeed(owner.id);
    await db.insert(reminder).values(seededReminder);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(otherUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/reminders/${seededReminder.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "No access update" }),
      }),
    );

    expect(response.status).toBe(404);
  });

  it("DELETE /api/reminders/:id deletes owned reminder", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    const seededReminder = createReminderSeed(seededUser.id);
    await db.insert(reminder).values(seededReminder);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/reminders/${seededReminder.id}`, {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(200);

    const [stored] = await db
      .select()
      .from(reminder)
      .where(eq(reminder.id, seededReminder.id))
      .limit(1);
    expect(stored).toBeUndefined();
  });

  it("DELETE /api/reminders/:id returns 404 for other user's reminder", async () => {
    const owner = createUserSeed();
    const otherUser = createUserSeed();
    seededUserIds.push(owner.id, otherUser.id);
    await db.insert(user).values([owner, otherUser]);

    const seededReminder = createReminderSeed(owner.id);
    await db.insert(reminder).values(seededReminder);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(otherUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/reminders/${seededReminder.id}`, {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(404);
  });

  it("PATCH /api/alerts/:id updates owned alert", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    const seededReminder = createReminderSeed(seededUser.id);
    await db.insert(reminder).values(seededReminder);
    const seededAlert = createAlertSeed(seededReminder.id);
    await db.insert(alert).values(seededAlert);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/alerts/${seededAlert.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ acknowledged: true }),
      }),
    );

    expect(response.status).toBe(200);

    const [stored] = await db.select().from(alert).where(eq(alert.id, seededAlert.id)).limit(1);
    expect(stored?.acknowledged).toBe(true);
  });

  it("PATCH /api/alerts/:id returns 404 for other user's alert", async () => {
    const owner = createUserSeed();
    const otherUser = createUserSeed();
    seededUserIds.push(owner.id, otherUser.id);
    await db.insert(user).values([owner, otherUser]);

    const ownerReminder = createReminderSeed(owner.id);
    const otherReminder = createReminderSeed(otherUser.id);
    await db.insert(reminder).values([ownerReminder, otherReminder]);

    const otherAlert = createAlertSeed(otherReminder.id);
    await db.insert(alert).values(otherAlert);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(owner.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/alerts/${otherAlert.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ acknowledged: true }),
      }),
    );

    expect(response.status).toBe(404);
  });

  it("PATCH /api/alerts/:id returns 400 for invalid payload", async () => {
    const seededUser = createUserSeed();
    seededUserIds.push(seededUser.id);
    await db.insert(user).values(seededUser);

    const seededReminder = createReminderSeed(seededUser.id);
    await db.insert(reminder).values(seededReminder);
    const seededAlert = createAlertSeed(seededReminder.id);
    await db.insert(alert).values(seededAlert);

    vi.spyOn(auth.api, "getSession").mockResolvedValue(mockSession(seededUser.id));

    const response = await app.fetch(
      new Request(`http://localhost/api/alerts/${seededAlert.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ acknowledged: "true" }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
