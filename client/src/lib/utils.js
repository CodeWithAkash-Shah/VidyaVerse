import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16); // 4 bytes
  const random = Math.random().toString(16).slice(2, 10); // 5 bytes
  const counter = Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0'); // 3 bytes
  return timestamp + random + counter; // 12 bytes (24 hex chars)
}
export default generateObjectId;