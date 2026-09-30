"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // next-themes inserts its transition style in its first effect, so the trusted
  // response nonce must be available on the first client render.
  const [documentNonce] = useState<string | undefined>(() => {
    if (typeof document === "undefined") return undefined;
    return document.head.querySelector<HTMLMetaElement>('meta[property="csp-nonce"]')?.content || undefined;
  });

  return (
    <NextThemesProvider {...props} nonce={props.nonce ?? documentNonce}>
      {children}
    </NextThemesProvider>
  );
}
