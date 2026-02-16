// ─── Enums ───────────────────────────────────────────────

export enum ItemBase {
    Ring = "Anneau",
    Pendant = "Pendentif",
    Bracelet = "Bracelet",
    Earring = "Boucle d'Oreille",
    Brooch = "Broche",
    Tiara = "Diadème",
    Chain = "Chaîne",
}

export enum Material {
    Iron = "Fer",
    Silver = "Argent",
    Gold = "Or",
    Platinum = "Platine",
    Orichalque = "Orichalque",
    Mithril = "Mithril",
    Adamantite = "Adamantite",
    Stardust = "Poussière d'Étoile",
}

export enum Gem {
    None = "Aucune",
    Quartz = "Quartz",
    Amethyst = "Améthyste",
    Ruby = "Rubis",
    Sapphire = "Saphir",
    Emerald = "Émeraude",
    Diamond = "Diamant",
    VoidSapphire = "Saphir du Vide",
    PhoenixOpal = "Opale du Phénix",
    DragonEye = "Œil de Dragon",
}

export enum Rarity {
    Poor = "Poor",
    Common = "Common",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
    Unique = "Unique",
}

// ─── Interfaces ──────────────────────────────────────────

/** A stat modifier granted by an enchantment */
export interface StatModifier {
    stat: string;
    value: number;
}

/** An enchantment (prefix or suffix) applied to an item */
export interface Enchantment {
    id: string;
    name: string;
    type: "prefix" | "suffix";
    modifiers: StatModifier[];
    /** Minimum rarity required for this enchantment to roll */
    minRarity: Rarity;
}

/** A crafting resource the player owns */
export interface Resource {
    id: string;
    material: Material;
    gem: Gem;
    quantity: number;
}

/** A recipe defines what's needed to craft an item */
export interface Recipe {
    id: string;
    name: string;
    base: ItemBase;
    requiredMaterial: Material;
    requiredGem: Gem;
    /** Minimum player level to use this recipe */
    minLevel: number;
    /** Base gold cost to craft */
    baseCost: number;
}

/** The final procedurally generated game item */
export interface GameItem {
    id: string;
    /** Procedurally generated display name */
    name: string;
    base: ItemBase;
    material: Material;
    gem: Gem;
    rarity: Rarity;
    enchantments: Enchantment[];
    /** Estimated value in virtual Gold */
    goldValue: number;
    /** Visual assembly key (e.g. "ring_mithril_ruby_legendary") */
    visualId: string;
    /** Player level at which this was crafted */
    craftedAtLevel: number;
    /** ISO timestamp of creation */
    craftedAt: string;
    /** Stats summary (aggregated from enchantments) */
    stats: Record<string, number>;
}

// ─── Rarity Config ───────────────────────────────────────

export interface RarityConfig {
    rarity: Rarity;
    weight: number;
    color: string;
    materialMultiplier: number;
    maxEnchantments: number;
}

// ─── Equipment ───────────────────────────────────────────

export enum EquipSlot {
    Head = "head",
    Necklace = "necklace",
    RingLeft = "ring_left",
    RingRight = "ring_right",
}

export const EQUIP_SLOT_LABELS: Record<EquipSlot, string> = {
    [EquipSlot.Head]: "Tête",
    [EquipSlot.Necklace]: "Collier",
    [EquipSlot.RingLeft]: "Anneau G",
    [EquipSlot.RingRight]: "Anneau D",
};

export const EQUIP_SLOT_ICONS: Record<EquipSlot, string> = {
    [EquipSlot.Head]: "👑",
    [EquipSlot.Necklace]: "📿",
    [EquipSlot.RingLeft]: "💍",
    [EquipSlot.RingRight]: "💍",
};

/** Maps item base types to their compatible equipment slot(s) */
export const ITEM_BASE_TO_SLOT: Record<ItemBase, EquipSlot[]> = {
    [ItemBase.Ring]: [EquipSlot.RingLeft, EquipSlot.RingRight],
    [ItemBase.Pendant]: [EquipSlot.Necklace],
    [ItemBase.Bracelet]: [EquipSlot.RingLeft, EquipSlot.RingRight],
    [ItemBase.Earring]: [EquipSlot.Head],
    [ItemBase.Brooch]: [EquipSlot.Necklace],
    [ItemBase.Tiara]: [EquipSlot.Head],
    [ItemBase.Chain]: [EquipSlot.Necklace],
};

// ─── Player Stats ────────────────────────────────────────

export interface PlayerStats {
    force: number;
    precision: number;
    chance: number;
}

// ─── Expedition ──────────────────────────────────────────

export interface ExpeditionZone {
    id: string;
    name: string;
    description: string;
    difficulty: number;    // 1-10
    minLevel: number;
    xpReward: number;
    /** Material IDs and their drop weights */
    lootTable: { material: string; weight: number }[];
    /** Chance of item drop (0-1) */
    itemDropChance: number;
    emoji: string;
}

export type ExpeditionLogType = "info" | "damage" | "loot" | "danger" | "victory" | "defeat";

export interface ExpeditionLogEntry {
    turn: number;
    message: string;
    type: ExpeditionLogType;
}

export interface ExpeditionResult {
    success: boolean;
    logs: ExpeditionLogEntry[];
    resourcesGained: Record<string, number>;
    itemsGained: GameItem[];
    xpGained: number;
    goldGained: number;
}
