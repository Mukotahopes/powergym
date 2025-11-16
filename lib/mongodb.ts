import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env.local");

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null; };
}

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "powergym",
      // @ts-ignore – опції можуть змінюватись між версіями, головне — dbName.
    } as any).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
