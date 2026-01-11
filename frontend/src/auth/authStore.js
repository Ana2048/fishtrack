const KEY = "ft_auth";

export function setAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken() {
  const a = getAuth();
  return a?.token || null;
}

export function getUser() {
  const a = getAuth();
  return a?.user || null;
}
