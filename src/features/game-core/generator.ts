import {
    type GameItem,
    type Recipe,
    type Enchantment,
    Rarity,
} from "./types";
import { rollRarity, meetsMinRarity, rarityIndex } from "./rarity";
import {
    MATERIAL_VALUES,
    GEM_VALUES,
    ENCHANTMENTS,
    UNIQUE_NAMES,
} from "./constants";

// ─── Helpers ─────────────────────────────────────────────

let _itemCounter = 0;

function generateId(): string {
    _itemCounter++;
    return `item_${Date.now()}_${_itemCounter.toString(36)}`;
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ─── Enchantment Roller ──────────────────────────────────

/**
 * Rolls enchantments for an item based on its rarity.
 * Rules:
 * - At most 1 prefix and 1 suffix at Rare.
 * - Higher rarities can stack more.
 * - Each enchantment must meet the item's rarity requirement.
 */
function rollEnchantments(rarity: Rarity, maxSlots: number): Enchantment[] {
    if (maxSlots === 0) return [];

    const eligible = ENCHANTMENTS.filter((e) => meetsMinRarity(rarity, e.minRarity));
    if (eligible.length === 0) return [];

    const pool = shuffled(eligible);
    const selected: Enchantment[] = [];
    let prefixCount = 0;
    let suffixCount = 0;
    const maxPerType = Math.ceil(maxSlots / 2);

    for (const ench of pool) {
        if (selected.length >= maxSlots) break;
        if (ench.type === "prefix" && prefixCount >= maxPerType) continue;
        if (ench.type === "suffix" && suffixCount >= maxPerType) continue;

        selected.push(ench);
        if (ench.type === "prefix") prefixCount++;
        else suffixCount++;
    }

    return selected;
}

// ─── Name Generator ──────────────────────────────────────

/**
 * Generates a procedural name for the item.
 *
 * Pattern:
 * - Poor/Common: "{Base} en {Material}"
 * - Rare/Epic:   "{Prefix} {Base} en {Material} {Suffix}"
 * - Legendary:   "{Prefix} {Base} en {Material} {Suffix}" (with better enchantments)
 * - Unique:      Picks from UNIQUE_NAMES pool
 */
function generateName(
    recipe: Recipe,
    rarity: Rarity,
    enchantments: Enchantment[]
): string {
    if (rarity === Rarity.Unique) {
        return pickRandom(UNIQUE_NAMES);
    }

    const prefix = enchantments.find((e) => e.type === "prefix");
    const suffix = enchantments.find((e) => e.type === "suffix");

    let name = `${recipe.base} en ${recipe.requiredMaterial}`;

    if (prefix) {
        name = `${prefix.name} ${name}`;
    }

    if (suffix) {
        name = `${name} ${suffix.name}`;
    }

    // Add gem to name if present
    if (recipe.requiredGem !== "Aucune") {
        name = `${name} (${recipe.requiredGem})`;
    }

    return name;
}

// ─── Visual ID Generator ─────────────────────────────────

function generateVisualId(recipe: Recipe, rarity: Rarity): string {
    const base = recipe.base.toLowerCase().replace(/[^a-z]/g, "_");
    const mat = recipe.requiredMaterial.toLowerCase().replace(/[^a-z]/g, "_");
    const gem = recipe.requiredGem.toLowerCase().replace(/[^a-z]/g, "_");
    const rar = rarity.toLowerCase();
    return `${base}_${mat}_${gem}_${rar}`;
}

// ─── Gold Value Calculator ───────────────────────────────

function calculateGoldValue(
    recipe: Recipe,
    rarity: Rarity,
    rarityMultiplier: number,
    enchantments: Enchantment[],
    playerLevel: number
): number {
    const materialVal = MATERIAL_VALUES[recipe.requiredMaterial] ?? 10;
    const gemVal = GEM_VALUES[recipe.requiredGem] ?? 0;

    // Base value = (material + gem) * rarity multiplier
    let value = (materialVal + gemVal) * rarityMultiplier;

    // Each enchantment adds 15% value
    value *= 1 + enchantments.length * 0.15;

    // Level bonus: +2% per player level
    value *= 1 + playerLevel * 0.02;

    // Add recipe base cost
    value += recipe.baseCost;

    // Randomize ±10%
    const variance = 0.9 + Math.random() * 0.2;
    value *= variance;

    return Math.round(value);
}

// ─── Aggregate Stats ─────────────────────────────────────

function aggregateStats(enchantments: Enchantment[]): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const ench of enchantments) {
        for (const mod of ench.modifiers) {
            stats[mod.stat] = (stats[mod.stat] ?? 0) + mod.value;
        }
    }
    return stats;
}

// ─── Main Generator ──────────────────────────────────────

/**
 * Generates a procedural GameItem from a recipe and player level.
 *
 * @param recipe - The crafting recipe to use.
 * @param playerLevel - The player's current level (affects rarity odds and value).
 * @returns A fully generated GameItem.
 *
 * @example
 * ```ts
 * import { generateItem } from "@/features/game-core/generator";
 * import { DEFAULT_RECIPES } from "@/features/game-core/constants";
 *
 * const item = generateItem(DEFAULT_RECIPES[0], 10);
 * console.log(item.name);      // "Glacial Anneau en Fer de l'Ours"
 * console.log(item.rarity);    // "Rare"
 * console.log(item.goldValue); // 342
 * ```
 */
export function generateItem(
    recipe: Recipe,
    playerLevel: number,
    options?: { forceMinRarity?: Rarity }
): GameItem {
    // Step 1: Roll rarity (with optional minimum override)
    let rarityConfig = rollRarity(playerLevel);
    if (options?.forceMinRarity) {
        let attempts = 0;
        while (
            rarityIndex(rarityConfig.rarity) < rarityIndex(options.forceMinRarity) &&
            attempts < 50
        ) {
            rarityConfig = rollRarity(playerLevel);
            attempts++;
        }
    }

    // Step 2: Roll enchantments
    const enchantments = rollEnchantments(
        rarityConfig.rarity,
        rarityConfig.maxEnchantments
    );

    // Step 3: Generate name
    const name = generateName(recipe, rarityConfig.rarity, enchantments);

    // Step 4: Calculate gold value
    const goldValue = calculateGoldValue(
        recipe,
        rarityConfig.rarity,
        rarityConfig.materialMultiplier,
        enchantments,
        playerLevel
    );

    // Step 5: Aggregate stats
    const stats = aggregateStats(enchantments);

    // Step 6: Build the item
    const item: GameItem = {
        id: generateId(),
        name,
        base: recipe.base,
        material: recipe.requiredMaterial,
        gem: recipe.requiredGem,
        rarity: rarityConfig.rarity,
        enchantments,
        goldValue,
        visualId: generateVisualId(recipe, rarityConfig.rarity),
        craftedAtLevel: playerLevel,
        craftedAt: new Date().toISOString(),
        stats,
    };

    return item;
}

/**
 * Generates multiple items at once (batch crafting / loot drop).
 */
export function generateLootDrop(
    recipe: Recipe,
    playerLevel: number,
    count: number
): GameItem[] {
    return Array.from({ length: count }, () => generateItem(recipe, playerLevel));
}
