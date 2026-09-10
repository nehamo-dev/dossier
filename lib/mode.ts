const KEY = "dossier-mode";

export function getDossierMode(): "demo" | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY) === "demo" ? "demo" : null;
  } catch {
    return null;
  }
}

export function setDemoMode() {
  try {
    window.localStorage.setItem(KEY, "demo");
  } catch {
    // ignore — private browsing / storage blocked
  }
}

export function clearDemoMode() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
