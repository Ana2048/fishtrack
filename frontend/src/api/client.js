import { getToken } from "../auth/authStore";

const BASE = "http://localhost:3000";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(r) {
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || `HTTP ${r.status}`);
  }
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) return r.json();
  return r.text();
}

export async function getJSON(path) {
  const r = await fetch(BASE + path, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  return handle(r);
}

export async function postJSON(path, body) {
  const r = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handle(r);
}

export async function patchJSON(path, body) {
  const r = await fetch(BASE + path, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handle(r);
}
