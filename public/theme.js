const names = ["light", "dark", "system"];
function preference() { try { const value = localStorage.getItem("theme"); return value && names.includes(value) ? value : "system"; } catch { return "system"; } }
function applyTheme(value) {
  const dark = value === "dark" || (value === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
  for (const button of document.querySelectorAll("[data-theme-choice]")) button.setAttribute("aria-pressed", String(button.dataset.themeChoice === value));
}
applyTheme(preference());
document.addEventListener("DOMContentLoaded", () => applyTheme(preference()));
document.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-theme-choice]") : null;
  const value = button?.dataset.themeChoice;
  if (!value || !names.includes(value)) return;
  try { localStorage.setItem("theme", value); } catch { /* Preferences remain usable without storage. */ }
  applyTheme(value);
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => applyTheme(preference()));
window.addEventListener("storage", () => applyTheme(preference()));

document.addEventListener("pointerdown", (event) => {
  const flag = document.querySelector("[data-hosting-flag]");
  if (flag?.open && !event.composedPath().includes(flag)) flag.open = false;
});
document.addEventListener("keydown", (event) => {
  const flag = document.querySelector("[data-hosting-flag]");
  if (event.key === "Escape" && flag?.open) { flag.open = false; flag.querySelector("summary")?.focus(); }
});
