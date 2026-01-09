export function getAuth() {
  try {
    const raw = localStorage.getItem("ft_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(data) {
  localStorage.setItem("ft_auth", JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem("ft_auth");
}
