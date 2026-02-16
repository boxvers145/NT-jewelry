import { create } from "zustand";
import {
    type GameItem,
    type PlayerStats,
    EquipSlot,
    ITEM_BASE_TO_SLOT,
} from "./types";
import { BASE_PLAYER_STATS, XP_TABLE, NPC_SELL_MULTIPLIER } from "./constants";

// ─── State Shape ─────────────────────────────────────────

interface GameState {
    // Data
    inventory: GameItem[];
    equippedItems: Partial<Record<EquipSlot, GameItem>>;
    resources: Record<string, number>;
    playerLevel: number;
    playerXP: number;
    gold: number;

    // Actions
    addToInventory: (item: GameItem) => void;
    removeFromInventory: (itemId: string) => void;
    equipItem: (item: GameItem, slot: EquipSlot) => void;
    unequipItem: (slot: EquipSlot) => void;
    addResources: (loot: Record<string, number>) => void;
    addXP: (amount: number) => void;
    addGold: (amount: number) => void;
    sellToNPC: (itemId: string) => void;
    getPlayerStats: () => PlayerStats;
    getCompatibleSlots: (item: GameItem) => EquipSlot[];
}

// ─── Helpers ─────────────────────────────────────────────

function computeStatsFromEquipment(equipped: Partial<Record<EquipSlot, GameItem>>): PlayerStats {
    const stats: PlayerStats = { ...BASE_PLAYER_STATS };

    for (const item of Object.values(equipped)) {
        if (!item) continue;
        // Map enchantment stats to player stats
        const s = item.stats;
        // "puissance" → force, "perception"/"agilité" → precision, "chance"/"charisme" → chance
        stats.force += (s["puissance"] ?? 0) + (s["endurance"] ?? 0);
        stats.precision += (s["agilité"] ?? 0) + (s["perception"] ?? 0);
        stats.chance += (s["charisme"] ?? 0) + (s["lumière"] ?? 0) + (s["renaissance"] ?? 0);
    }

    return stats;
}

function getXPForLevel(level: number): number {
    if (level < XP_TABLE.length) return XP_TABLE[level];
    // Beyond table: exponential scaling
    return XP_TABLE[XP_TABLE.length - 1] + (level - XP_TABLE.length + 1) * 15000;
}

// ─── Store ───────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
    inventory: [],
    equippedItems: {},
    resources: {
        "Fer": 10,
        "Quartz": 5,
    },
    playerLevel: 1,
    playerXP: 0,
    gold: 200,

    addToInventory: (item) =>
        set((state) => ({ inventory: [...state.inventory, item] })),

    removeFromInventory: (itemId) =>
        set((state) => ({ inventory: state.inventory.filter((i) => i.id !== itemId) })),

    equipItem: (item, slot) =>
        set((state) => {
            const currentlyEquipped = state.equippedItems[slot];
            const newInventory = state.inventory.filter((i) => i.id !== item.id);

            // If something was already in the slot, put it back in inventory
            if (currentlyEquipped) {
                newInventory.push(currentlyEquipped);
            }

            return {
                inventory: newInventory,
                equippedItems: { ...state.equippedItems, [slot]: item },
            };
        }),

    unequipItem: (slot) =>
        set((state) => {
            const item = state.equippedItems[slot];
            if (!item) return state;

            const newEquipped = { ...state.equippedItems };
            delete newEquipped[slot];

            return {
                equippedItems: newEquipped,
                inventory: [...state.inventory, item],
            };
        }),

    addResources: (loot) =>
        set((state) => {
            const newResources = { ...state.resources };
            for (const [key, amount] of Object.entries(loot)) {
                newResources[key] = (newResources[key] ?? 0) + amount;
            }
            return { resources: newResources };
        }),

    addXP: (amount) =>
        set((state) => {
            let xp = state.playerXP + amount;
            let level = state.playerLevel;

            // Auto level-up
            while (xp >= getXPForLevel(level + 1)) {
                xp -= getXPForLevel(level + 1);
                level++;
            }

            return { playerXP: xp, playerLevel: level };
        }),

    addGold: (amount) =>
        set((state) => ({ gold: state.gold + amount })),

    sellToNPC: (itemId) =>
        set((state) => {
            const item = state.inventory.find((i) => i.id === itemId);
            if (!item) return state;

            const sellPrice = Math.round(item.goldValue * NPC_SELL_MULTIPLIER);

            return {
                inventory: state.inventory.filter((i) => i.id !== itemId),
                gold: state.gold + sellPrice,
            };
        }),

    getPlayerStats: () => computeStatsFromEquipment(get().equippedItems),

    getCompatibleSlots: (item) => ITEM_BASE_TO_SLOT[item.base] ?? [],
}));

// Re-export helper for XP progress calculation
export function getXPProgress(level: number, currentXP: number): { current: number; required: number; percentage: number } {
    const required = getXPForLevel(level + 1);
    return {
        current: currentXP,
        required,
        percentage: required > 0 ? Math.min((currentXP / required) * 100, 100) : 100,
    };
}
