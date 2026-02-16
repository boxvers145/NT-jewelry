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
