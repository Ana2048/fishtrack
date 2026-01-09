import { getToken } from "../auth/authStore";

const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const apiUrl = base.replace(/\/$/, "");

export async function getJSON(path) {
  const r = await fetch(apiUrl + path, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}

export async function postJSON(path, body) {
  const r = await fetch(apiUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}
