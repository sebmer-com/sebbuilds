"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const themes = [
  { name: "light", label: "Light mode", Icon: Sun },
  { name: "system", label: "Use system theme", Icon: Monitor },
  { name: "dark", label: "Dark mode", Icon: Moon },
] as const;
const themeNames = themes.map(({ name }) => name);
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    clientSnapshot,
    serverSnapshot,
  );

  const activeTheme =
    mounted && themeNames.includes(theme as (typeof themeNames)[number])
      ? theme
      : "system";

  return (
    <div className="theme-selector" role="group" aria-label="Color theme">
      {themes.map(({ name, label, Icon }) => (
        <button
          aria-label={label}
          aria-pressed={activeTheme === name}
          className="theme-selector__option"
          key={name}
          onClick={() => setTheme(name)}
          suppressHydrationWarning
          title={label}
          type="button"
        >
          <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
