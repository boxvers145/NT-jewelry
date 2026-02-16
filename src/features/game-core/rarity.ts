import { Rarity, type RarityConfig } from "./types";
import { RARITY_TABLE } from "./constants";

/**
 * Rolls a rarity using weighted random selection.
 *
 * @param levelBonus - Player level bonus (higher level = better odds).
 *                     Each level point shifts 0.5 weight from Poor/Common to Rare+.
 * @returns The rolled RarityConfig entry.
 *
 * @example
 * const result = rollRarity(10);
 * console.log(result.rarity); // e.g. "Rare"
 */
export function rollRarity(levelBonus: number = 0): RarityConfig {
    // Clone weights so we can mutate them safely
    const adjusted = RARITY_TABLE.map((entry) => ({ ...entry }));

    // Apply level bonus: shift weight from lower tiers to higher tiers
    const luckFactor = Math.min(levelBonus * 0.5, 20); // Cap at 20

    // Reduce Poor & Common weights
    const poorIdx = adjusted.findIndex((e) => e.rarity === Rarity.Poor);
    const commonIdx = adjusted.findIndex((e) => e.rarity === Rarity.Common);
    const rareIdx = adjusted.findIndex((e) => e.rarity === Rarity.Rare);
    const epicIdx = adjusted.findIndex((e) => e.rarity === Rarity.Epic);
    const legendaryIdx = adjusted.findIndex((e) => e.rarity === Rarity.Legendary);

    if (poorIdx >= 0) adjusted[poorIdx].weight = Math.max(5, adjusted[poorIdx].weight - luckFactor);
    if (commonIdx >= 0) adjusted[commonIdx].weight = Math.max(5, adjusted[commonIdx].weight - luckFactor * 0.5);
    if (rareIdx >= 0) adjusted[rareIdx].weight += luckFactor * 0.3;
    if (epicIdx >= 0) adjusted[epicIdx].weight += luckFactor * 0.3;
    if (legendaryIdx >= 0) adjusted[legendaryIdx].weight += luckFactor * 0.2;

    // Compute total weight
    const totalWeight = adjusted.reduce((sum, e) => sum + e.weight, 0);

    // Roll
    let roll = Math.random() * totalWeight;

    for (const entry of adjusted) {
        roll -= entry.weight;
        if (roll <= 0) return entry;
    }

    // Fallback (shouldn't reach here)
    return adjusted[0];
}

/**
 * Returns the rarity index (0 = Poor, 5 = Unique).
 * Useful for comparisons.
 */
export function rarityIndex(rarity: Rarity): number {
    const order = [Rarity.Poor, Rarity.Common, Rarity.Rare, Rarity.Epic, Rarity.Legendary, Rarity.Unique];
    return order.indexOf(rarity);
}

/**
 * Checks if a rarity meets a minimum threshold.
 */
export function meetsMinRarity(actual: Rarity, minimum: Rarity): boolean {
    return rarityIndex(actual) >= rarityIndex(minimum);
}
