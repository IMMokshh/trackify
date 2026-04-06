import { CATEGORY_COST_DEFAULTS } from "./serviceData";

/**
 * Strong keyword-based cost estimator for Indian market.
 * Checks HIGH-cost keywords first so POP/renovation never falls through to cheap defaults.
 * Falls back to category default if no keyword matches.
 */
export const estimateCost = (text: string, category?: string): string | null => {
  const t = text.toLowerCase();

  // --- PURCHASE INTENT (check first — never assign repair cost to purchases) ---
  if (t.startsWith("user wants to purchase") || t.includes("want to purchase") || t.includes("wants to buy")) {
    if (t.includes("furniture") || t.includes("sofa") || t.includes("bed") || t.includes("wardrobe")) return "Rs. 5,000 - Rs. 50,000";
    if (t.includes("appliance") || t.includes("fridge") || t.includes("washing machine") || t.includes("tv")) return "Rs. 5,000 - Rs. 80,000";
    return "Rs. 200 - Rs. 2,000";
  }

  // --- HIGH COST REPAIRS ---
  if (t.includes("full renovation") || t.includes("complete renovation")) return "Rs. 1,00,000 - Rs. 5,00,000";
  if (t.includes("pop") || t.includes("false ceiling") || t.includes("ceiling work") || t.includes("plaster of paris")) return "Rs. 50,000 - Rs. 1,50,000";
  if (t.includes("waterproof") || t.includes("seepage") || t.includes("terrace repair")) return "Rs. 15,000 - Rs. 50,000";
  if (t.includes("lift") || t.includes("elevator")) return "Rs. 10,000 - Rs. 50,000";
  if (t.includes("cctv") || t.includes("security camera")) return "Rs. 5,000 - Rs. 20,000";
  if (t.includes("motor") || t.includes("pump")) return "Rs. 5,000 - Rs. 15,000";
  if (t.includes("solar panel") || t.includes("solar installation")) return "Rs. 30,000 - Rs. 1,50,000";

  // --- MEDIUM COST REPAIRS / SERVICES ---
  if (t.includes("painting") || t.includes("paint")) return "Rs. 5,000 - Rs. 30,000";
  if (t.includes("short circuit") || t.includes("rewiring") || t.includes("full wiring")) return "Rs. 3,000 - Rs. 15,000";
  if (t.includes("burst") || t.includes("major pipe")) return "Rs. 3,000 - Rs. 10,000";
  if (t.includes("installation") || t.includes("install new") || t.includes("new fitting")) return "Rs. 2,000 - Rs. 8,000";
  if (t.includes("pest") || t.includes("termite") || t.includes("cockroach") || t.includes("bed bug")) return "Rs. 1,500 - Rs. 5,000";
  if (t.includes("ac") || t.includes("air condition")) return "Rs. 500 - Rs. 3,000";
  if (t.includes("laptop") || t.includes("computer") || t.includes("pc repair")) return "Rs. 500 - Rs. 3,000";
  if (t.includes("gaming") || t.includes("gaming setup")) return "Rs. 1,000 - Rs. 5,000";

  // --- REPAIR INTENT (broken/not working) ---
  if (t.includes("not working") || t.includes("broken") || t.includes("damaged") || t.includes("stopped working")) {
    // Only apply if it's clearly a repair context, not a purchase
    if (!t.includes("want") && !t.includes("buy") && !t.includes("purchase")) {
      return "Rs. 500 - Rs. 3,000";
    }
  }

  // --- LOW COST SERVICES ---
  if (t.includes("wiring") || t.includes("electrical")) return "Rs. 500 - Rs. 5,000";
  if (t.includes("leak") || t.includes("drip") || t.includes("tap") || t.includes("plumbing")) return "Rs. 300 - Rs. 2,000";
  if (t.includes("cleaning") || t.includes("clean") || t.includes("sweep")) return "Rs. 300 - Rs. 1,500";
  if (t.includes("grooming") || t.includes("haircut") || t.includes("salon")) return "Rs. 200 - Rs. 800";
  if (t.includes("dog") || t.includes("cat") || t.includes("pet")) return "Rs. 200 - Rs. 800";
  if (t.includes("tiffin") || t.includes("food delivery") || t.includes("meal")) return "Rs. 100 - Rs. 500";
  if (t.includes("catering") || t.includes("event food") || t.includes("party food")) return "Rs. 2,000 - Rs. 20,000";
  if (t.includes("tutor") || t.includes("class") || t.includes("lesson")) return "Rs. 300 - Rs. 1,500";
  if (t.includes("yoga") || t.includes("fitness") || t.includes("trainer")) return "Rs. 300 - Rs. 1,000";
  if (t.includes("bulb") || t.includes("switch") || t.includes("socket")) return "Rs. 150 - Rs. 600";
  if (t.includes("door") || t.includes("window") || t.includes("hinge") || t.includes("lock")) return "Rs. 300 - Rs. 2,000";
  if (t.includes("minor") || t.includes("small") || t.includes("quick fix")) return "Rs. 150 - Rs. 600";
  if (t.includes("laundry") || t.includes("dry clean") || t.includes("ironing")) return "Rs. 100 - Rs. 500";
  if (t.includes("car wash") || t.includes("bike wash")) return "Rs. 100 - Rs. 500";

  return category ? (CATEGORY_COST_DEFAULTS[category] ?? null) : null;
};
