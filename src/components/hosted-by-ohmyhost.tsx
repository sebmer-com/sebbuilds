"use client";

import { useEffect, useRef } from "react";
import styles from "./hosted-by-ohmyhost.module.css";

export function HostedByOhmyhost() {
  const flagRef = useRef<HTMLDetailsElement>(null);
  const toggleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      const flag = flagRef.current;
      if (flag?.open && !event.composedPath().includes(flag)) {
        flag.open = false;
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      const flag = flagRef.current;
      if (event.key === "Escape" && flag?.open) {
        flag.open = false;
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className={styles.flag} ref={flagRef}>
      <summary className={styles.toggle} ref={toggleRef}>
        <svg
          aria-hidden="true"
          className={styles.omega}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="12.5"
          viewBox="0 0 100 100"
        >
          <path d="M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70" />
        </svg>
        <span aria-hidden="true" className={styles.close}>
          &gt;
        </span>
        <span className={`${styles.label} ${styles.showLabel}`}>
          Show hosting information
        </span>
        <span className={`${styles.label} ${styles.hideLabel}`}>
          Close hosting information
        </span>
      </summary>
      <a
        className={styles.link}
        href="https://ohmyho.st/?r=ref-01m3acd03m6jevgydfgg3t0j9q"
        rel="sponsored noopener"
        target="_blank"
      >
        Hosted on ohmyho.st
      </a>
    </details>
  );
}
