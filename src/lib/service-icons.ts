import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Handshake,
  HeartPulse,
  Home,
  Leaf,
  Scale,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Curated professional icon set offered in the admin "Icon" field. */
export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  handshake: Handshake,
  leaf: Leaf,
  briefcase: Briefcase,
  home: Home,
  users: Users,
  "book-open": BookOpen,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  scale: Scale,
  "graduation-cap": GraduationCap,
  shield: Shield,
  sparkles: Sparkles,
};

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICON_MAP).map((value) => ({
  value,
  label: value
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" "),
}));

/** Resolves a stored icon key to its component. Falls back to a generic mark. */
export function resolveServiceIcon(icon?: string | null): LucideIcon | null {
  if (!icon) return null;
  return SERVICE_ICON_MAP[icon] ?? Sparkles;
}
