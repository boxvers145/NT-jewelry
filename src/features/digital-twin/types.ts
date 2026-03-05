import { GameItem } from "@/features/game-core/types";

/**
 * Represents an item in the user's continuous digital twin collection.
 * It wraps a base GameItem and adds a quantity to handle stacking identical items.
 */
export interface UserInventoryItem {
    /** Unique identifier for the stack (often identical to the GameItem.visualId or base GameItem id) */
    id: string;
    /** The base game item definition */
    item: GameItem;
    /** How many of this exact item the user owns */
    quantity: number;
    /** ISO string indicating when the first of this item was acquired */
    acquiredAt: string;
}
