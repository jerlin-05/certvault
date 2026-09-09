"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body instead of wherever this component
 * sits in the React tree. This matters for anything using `position: fixed`
 * (modals, dialogs, sheets): if a fixed element is nested inside an ancestor
 * that has `transform`, `filter`, `backdrop-filter`, `perspective`, or
 * `will-change: transform`, that ancestor becomes the fixed element's
 * containing block instead of the viewport — the modal then gets clipped to
 * that ancestor's box instead of covering the whole screen. Portaling to
 * document.body sidesteps that entirely.
 */
export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
