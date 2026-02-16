import {
    type RarityConfig,
    type Enchantment,
    type Recipe,
    Rarity,
    Material,
    Gem,
    ItemBase,
} from "./types";

// ─── Rarity Table ────────────────────────────────────────
// Weights are relative (not percentages). Higher = more common.

export const RARITY_TABLE: RarityConfig[] = [
    { rarity: Rarity.Poor, weight: 40, color: "#9CA3AF", materialMultiplier: 0.5, maxEnchantments: 0 },
    { rarity: Rarity.Common, weight: 30, color: "#E5E7EB", materialMultiplier: 1.0, maxEnchantments: 1 },
    { rarity: Rarity.Rare, weight: 15, color: "#3B82F6", materialMultiplier: 1.8, maxEnchantments: 2 },
    { rarity: Rarity.Epic, weight: 10, color: "#A855F7", materialMultiplier: 3.0, maxEnchantments: 3 },
    { rarity: Rarity.Legendary, weight: 4, color: "#F59E0B", materialMultiplier: 5.0, maxEnchantments: 4 },
    { rarity: Rarity.Unique, weight: 1, color: "#EF4444", materialMultiplier: 10.0, maxEnchantments: 5 },
];

// ─── Material Values ─────────────────────────────────────
// Base gold value per material unit

export const MATERIAL_VALUES: Record<Material, number> = {
    [Material.Iron]: 10,
    [Material.Silver]: 25,
    [Material.Gold]: 50,
    [Material.Platinum]: 80,
    [Material.Orichalque]: 120,
    [Material.Mithril]: 200,
    [Material.Adamantite]: 350,
    [Material.Stardust]: 500,
};

// ─── Gem Values ──────────────────────────────────────────

export const GEM_VALUES: Record<Gem, number> = {
    [Gem.None]: 0,
    [Gem.Quartz]: 15,
    [Gem.Amethyst]: 30,
    [Gem.Ruby]: 60,
    [Gem.Sapphire]: 60,
    [Gem.Emerald]: 75,
    [Gem.Diamond]: 120,
    [Gem.VoidSapphire]: 200,
    [Gem.PhoenixOpal]: 250,
    [Gem.DragonEye]: 400,
};

// ─── Enchantments Pool ───────────────────────────────────

export const ENCHANTMENTS: Enchantment[] = [
    // Prefixes
    { id: "flaming", name: "Flamboyant", type: "prefix", modifiers: [{ stat: "puissance", value: 12 }], minRarity: Rarity.Common },
    { id: "frozen", name: "Glacial", type: "prefix", modifiers: [{ stat: "résistance", value: 10 }], minRarity: Rarity.Common },
    { id: "venomous", name: "Venimeux", type: "prefix", modifiers: [{ stat: "poison", value: 8 }], minRarity: Rarity.Rare },
    { id: "radiant", name: "Radieux", type: "prefix", modifiers: [{ stat: "lumière", value: 15 }], minRarity: Rarity.Rare },
    { id: "void-touched", name: "Touché par le Vide", type: "prefix", modifiers: [{ stat: "ombre", value: 25 }, { stat: "puissance", value: 10 }], minRarity: Rarity.Epic },
    { id: "celestial", name: "Céleste", type: "prefix", modifiers: [{ stat: "lumière", value: 30 }, { stat: "charisme", value: 15 }], minRarity: Rarity.Legendary },
    { id: "primordial", name: "Primordial", type: "prefix", modifiers: [{ stat: "puissance", value: 40 }, { stat: "résistance", value: 20 }], minRarity: Rarity.Unique },

    // Suffixes
    { id: "bear", name: "de l'Ours", type: "suffix", modifiers: [{ stat: "endurance", value: 10 }], minRarity: Rarity.Common },
    { id: "fox", name: "du Renard", type: "suffix", modifiers: [{ stat: "agilité", value: 10 }], minRarity: Rarity.Common },
    { id: "eagle", name: "de l'Aigle", type: "suffix", modifiers: [{ stat: "perception", value: 8 }], minRarity: Rarity.Rare },
    { id: "phoenix", name: "du Phénix", type: "suffix", modifiers: [{ stat: "renaissance", value: 20 }], minRarity: Rarity.Epic },
    { id: "night", name: "de la Nuit", type: "suffix", modifiers: [{ stat: "ombre", value: 15 }, { stat: "agilité", value: 5 }], minRarity: Rarity.Rare },
    { id: "dragon", name: "du Dragon", type: "suffix", modifiers: [{ stat: "puissance", value: 25 }, { stat: "endurance", value: 15 }], minRarity: Rarity.Legendary },
    { id: "cosmos", name: "du Cosmos", type: "suffix", modifiers: [{ stat: "lumière", value: 35 }, { stat: "perception", value: 20 }], minRarity: Rarity.Unique },
];

// ─── Unique Names Pool ───────────────────────────────────
// Used only for Unique rarity items

export const UNIQUE_NAMES: string[] = [
    "L'Œil d'Éternité",
    "Le Dernier Souffle du Roi",
    "Fragment de l'Étoile Morte",
    "Le Sceau du Boss Final",
    "Larme Cristallisée de Sélène",
    "Le Poinçon du Néant",
    "Couronne de l'Aube Brisée",
    "Anneau du Monde Inversé",
];

// ─── Default Recipes ─────────────────────────────────────

export const DEFAULT_RECIPES: Recipe[] = [
    { id: "r001", name: "Anneau Simple", base: ItemBase.Ring, requiredMaterial: Material.Iron, requiredGem: Gem.None, minLevel: 1, baseCost: 50 },
    { id: "r002", name: "Pendentif en Argent", base: ItemBase.Pendant, requiredMaterial: Material.Silver, requiredGem: Gem.Quartz, minLevel: 3, baseCost: 120 },
    { id: "r003", name: "Bracelet Doré", base: ItemBase.Bracelet, requiredMaterial: Material.Gold, requiredGem: Gem.Amethyst, minLevel: 5, baseCost: 250 },
    { id: "r004", name: "Boucle en Platine", base: ItemBase.Earring, requiredMaterial: Material.Platinum, requiredGem: Gem.Ruby, minLevel: 8, baseCost: 400 },
    { id: "r005", name: "Broche d'Orichalque", base: ItemBase.Brooch, requiredMaterial: Material.Orichalque, requiredGem: Gem.Sapphire, minLevel: 12, baseCost: 600 },
    { id: "r006", name: "Diadème de Mithril", base: ItemBase.Tiara, requiredMaterial: Material.Mithril, requiredGem: Gem.Diamond, minLevel: 18, baseCost: 1200 },
    { id: "r007", name: "Chaîne d'Adamantite", base: ItemBase.Chain, requiredMaterial: Material.Adamantite, requiredGem: Gem.VoidSapphire, minLevel: 25, baseCost: 2500 },
    { id: "r008", name: "Anneau Stellaire", base: ItemBase.Ring, requiredMaterial: Material.Stardust, requiredGem: Gem.DragonEye, minLevel: 30, baseCost: 5000 },
];
