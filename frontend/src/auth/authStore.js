const KEY = "ft_auth";

// { token: "...", user: { id, name, email, role } }
export function setAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;

    // user poate fi fie în parsed.user, fie direct în parsed
    const user = parsed.user || parsed;
    return { token: parsed.token, user };
  } catch {
    return null;
  }
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getUser() {
  return getAuth()?.user || null;
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
