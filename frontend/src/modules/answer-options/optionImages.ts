import type { OptionId } from "./types";

// Vite collects all icons at build time; keys look like "../../assets/options/food/grass.webp"
const iconModules = import.meta.glob<string>("../../assets/options/*/*.webp", {
  eager: true,
  import: "default",
});

const iconsById = new Map<string, string>(
  Object.entries(iconModules).map(([path, url]) => [path.slice(path.lastIndexOf("/") + 1, -".webp".length), url]),
);

/** Image URL for habitat and food options; colors are drawn with CSS instead. */
export function getOptionImage(id: OptionId): string | undefined {
  return iconsById.get(id);
}

/** CSS colors for color options; habitat and food ids are simply absent. */
export const colorSwatches: Readonly<Partial<Record<OptionId, string>>> = {
  gray: "#9aa0a6",
  brown: "#8b5a3c",
  orange: "#f28c28",
  yellow: "#f7d038",
  white: "#ffffff",
  black: "#2b2b2b",
  pink: "#f4a6c0",
  green: "#5aa95a",
  blue: "#3d8bd9",
  red: "#e04848",
  purple: "#8e5cc4",
};
