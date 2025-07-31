import crypto from "crypto";

export function generateRoomId(length = 10):string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}


