const KEY = "ft_auth";

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
}
export function setAuth(payload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}
export function clearAuth() {
  localStorage.removeItem(KEY);
}
export function getToken() {
  const a = getAuth();
  return a?.token || "";
}
export function getUser() {
  const a = getAuth();
  return a?.user || null;
}
