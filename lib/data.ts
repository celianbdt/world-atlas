import type { AtlasPoint } from "./types";
import monuments from "@/data/monuments.json";
import ingredients from "@/data/ingredients.json";
import ingredients2 from "@/data/ingredients2.json";
import dishes from "@/data/dishes.json";
import dishes2 from "@/data/dishes2.json";
import sports from "@/data/sports.json";
import animals from "@/data/animals.json";
import plants from "@/data/plants.json";
import foodSportExtra from "@/data/food_sport_extra.json";
import natureExtra from "@/data/nature_extra.json";

export const ALL_POINTS: AtlasPoint[] = [
  ...(monuments as AtlasPoint[]),
  ...(ingredients as AtlasPoint[]),
  ...(ingredients2 as AtlasPoint[]),
  ...(dishes as AtlasPoint[]),
  ...(dishes2 as AtlasPoint[]),
  ...(sports as AtlasPoint[]),
  ...(animals as AtlasPoint[]),
  ...(plants as AtlasPoint[]),
  ...(foodSportExtra as AtlasPoint[]),
  ...(natureExtra as AtlasPoint[]),
];

export function countByCategory(points: AtlasPoint[]) {
  return points.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
}
