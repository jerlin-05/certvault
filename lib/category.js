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
  General: { icon: Layers, accent: "#9CA3AF" },
  Education: { icon: GraduationCap, accent: "#8B5CF6" },
  Professional: { icon: BadgeCheck, accent: "#34D399" },
  "Health & Safety": { icon: HeartPulse, accent: "#FB7185" },
  Legal: { icon: Scale, accent: "#C4B5FD" },
  "IT & Security": { icon: ShieldCheck, accent: "#60A5FA" },
  Insurance: { icon: Umbrella, accent: "#FBBF24" },
};

export function getCategoryTheme(category) {
  return CATEGORY_THEME[category] || CATEGORY_THEME.General;
}
