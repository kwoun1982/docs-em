/* docs-em — 테마(다크/라이트) 제어. <html data-theme> 를 토글한다.
   기본은 다크(정본). data-theme 미설정 = 다크(:root), "light" = 밝은 테마.
   선택은 sessionStorage 에 저장해 새로고침 시 유지(목업 단계 — 가벼운 보존). */

const KEY = "docsem-theme";

export function getTheme() {
  try { return sessionStorage.getItem(KEY) || "dark"; } catch { return "dark"; }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");   // 다크 = 기본(:root)
  try { sessionStorage.setItem(KEY, theme); } catch {}
}

export function initTheme() { applyTheme(getTheme()); }
