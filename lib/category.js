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
  Education: { icon: GraduationCap, accent: "#C9A15A" },
  Professional: { icon: BadgeCheck, accent: "#0FA968" },
  "Health & Safety": { icon: HeartPulse, accent: "#E74444" },
  Legal: { icon: Scale, accent: "#0E1526" },
  "IT & Security": { icon: ShieldCheck, accent: "#141D34" },
  Insurance: { icon: Umbrella, accent: "#F2A70B" },
};

export function getCategoryTheme(category) {
  return CATEGORY_THEME[category] || CATEGORY_THEME.General;
}
