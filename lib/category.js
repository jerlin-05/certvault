import {
  Layers,
  GraduationCap,
  BadgeCheck,
  HeartPulse,
  Scale,
  ShieldCheck,
  Umbrella,
} from "lucide-react";

export const CATEGORY_THEME = {
  General: { icon: Layers, accent: "#5B6472" },
  Education: { icon: GraduationCap, accent: "#B8863B" },
  Professional: { icon: BadgeCheck, accent: "#2F6844" },
  "Health & Safety": { icon: HeartPulse, accent: "#A1352B" },
  Legal: { icon: Scale, accent: "#121B2E" },
  "IT & Security": { icon: ShieldCheck, accent: "#1B2740" },
  Insurance: { icon: Umbrella, accent: "#C97A2B" },
};

export function getCategoryTheme(category) {
  return CATEGORY_THEME[category] || CATEGORY_THEME.General;
}
