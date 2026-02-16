"use client";

import { useState, useCallback } from "react";
import {
    type ExpeditionZone,
    type ExpeditionLogEntry,
    type ExpeditionResult,
    type PlayerStats,
    type GameItem,
} from "./types";
import { DEFAULT_RECIPES } from "./constants";
import { generateItem } from "./generator";

// ─── Combat Messages ─────────────────────────────────────

const ATTACK_MESSAGES = [
    "Vous frappez l'ennemi avec votre bijou enchantant",
    "Un éclat de lumière jaillit de votre collier",
    "Votre anneau pulse d'énergie et frappe",
    "Vous lancez une attaque précise",
    "Vos bijoux brillent et infligent des dégâts",
];

const ENEMY_MESSAGES = [
    "Le Gobelin vous attaque vicieusement",
    "Un Esprit Sombre vous lance un sort",
    "Le Gardien de Pierre se jette sur vous",
    "Une créature surgit des ténèbres",
    "Le Golem de Cristal charge",
];

const LOOT_MESSAGES = [
    "scintille au sol ! Vous ramassez",
    "tombe de l'ennemi vaincu :",
    "apparaît dans un éclat doré :",
    "se matérialise après le combat :",
];

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function rollWeighted(table: { material: string; weight: number }[]): string {
    const total = table.reduce((sum, t) => sum + t.weight, 0);
    let roll = Math.random() * total;
    for (const entry of table) {
        roll -= entry.weight;
        if (roll <= 0) return entry.material;
    }
    return table[0].material;
}

// ─── Hook ────────────────────────────────────────────────

export function useExpedition() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<ExpeditionLogEntry[]>([]);
    const [result, setResult] = useState<ExpeditionResult | null>(null);

    const runExpedition = useCallback(
        (zone: ExpeditionZone, stats: PlayerStats, playerLevel: number): Promise<ExpeditionResult> => {
            return new Promise((resolve) => {
                setIsRunning(true);
                setLogs([]);
                setResult(null);

                const totalTurns = 5 + Math.floor(zone.difficulty / 2);
                const allLogs: ExpeditionLogEntry[] = [];
                const resourcesGained: Record<string, number> = {};
                const itemsGained: GameItem[] = [];
                let goldGained = 0;

                // Player power vs zone difficulty
                const totalPower = stats.force + stats.precision + stats.chance;
                const powerRatio = totalPower / (zone.difficulty * 15);
                const baseSuccessChance = Math.min(0.4 + powerRatio * 0.3, 0.95);

                let turnIndex = 0;

                const processTurn = () => {
                    if (turnIndex >= totalTurns) {
                        // Final result
                        const xpGained = Math.round(zone.xpReward * (0.8 + Math.random() * 0.4));
                        const success = allLogs.filter(l => l.type === "damage").length < totalTurns * 0.6;

                        const victoryLog: ExpeditionLogEntry = {
                            turn: turnIndex + 1,
                            message: success
                                ? `🏆 Expédition réussie ! Vous revenez victorieux avec ${xpGained} XP.`
                                : `💀 Vous battez en retraite... mais conservez votre butin. +${xpGained} XP.`,
                            type: success ? "victory" : "defeat",
                        };
                        allLogs.push(victoryLog);

                        const finalResult: ExpeditionResult = {
                            success,
                            logs: allLogs,
                            resourcesGained,
                            itemsGained,
                            xpGained,
                            goldGained,
                        };

                        setLogs([...allLogs]);
                        setResult(finalResult);
                        setIsRunning(false);
                        resolve(finalResult);
                        return;
                    }

                    const turn = turnIndex + 1;
                    const turnLogs: ExpeditionLogEntry[] = [];

                    // Player attack
                    const hitChance = baseSuccessChance + (stats.precision * 0.01);
                    if (Math.random() < hitChance) {
                        const damage = Math.round((stats.force * 2 + Math.random() * 10) * (1 + zone.difficulty * 0.1));
                        turnLogs.push({
                            turn,
                            message: `⚔️ ${pickRandom(ATTACK_MESSAGES)} — ${damage} dégâts !`,
                            type: "info",
                        });

                        // Loot chance on hit
                        const lootRoll = Math.random();
                        const lootChance = 0.4 + (stats.chance * 0.02);
                        if (lootRoll < lootChance) {
                            const material = rollWeighted(zone.lootTable);
                            const qty = 1 + Math.floor(Math.random() * (1 + zone.difficulty / 3));
                            resourcesGained[material] = (resourcesGained[material] ?? 0) + qty;
                            turnLogs.push({
                                turn,
                                message: `✨ Du ${material} ${pickRandom(LOOT_MESSAGES)} x${qty}`,
                                type: "loot",
                            });
                        }

                        // Gold drops
                        if (Math.random() < 0.3) {
                            const goldDrop = Math.round(5 + Math.random() * zone.difficulty * 8);
                            goldGained += goldDrop;
                            turnLogs.push({
                                turn,
                                message: `💰 Vous trouvez ${goldDrop} pièces d'or !`,
                                type: "loot",
                            });
                        }
                    } else {
                        turnLogs.push({
                            turn,
                            message: `💨 Votre attaque manque sa cible...`,
                            type: "info",
                        });
                    }

                    // Enemy attack
                    const enemyHitChance = 0.5 - (stats.precision * 0.005);
                    if (Math.random() < enemyHitChance) {
                        const enemyDamage = Math.round(zone.difficulty * 3 + Math.random() * 5);
                        turnLogs.push({
                            turn,
                            message: `🩸 ${pickRandom(ENEMY_MESSAGES)} — ${enemyDamage} dégâts subis !`,
                            type: "danger",
                        });
                    }

                    // Rare item drop (end of zone)
                    if (turnIndex === totalTurns - 1 && Math.random() < zone.itemDropChance * (1 + stats.chance * 0.02)) {
                        const recipe = pickRandom(DEFAULT_RECIPES.filter(r => r.minLevel <= playerLevel + 3));
                        if (recipe) {
                            const item = generateItem(recipe, playerLevel);
                            itemsGained.push(item);
                            turnLogs.push({
                                turn,
                                message: `🎁 Drop rare ! Vous obtenez : "${item.name}" (${item.rarity}) !`,
                                type: "loot",
                            });
                        }
                    }

                    allLogs.push(...turnLogs);
                    setLogs([...allLogs]);
                    turnIndex++;

                    // Delay next turn for dramatic effect
                    setTimeout(processTurn, 600 + Math.random() * 400);
                };

                // Start first turn after a short delay
                setTimeout(processTurn, 500);
            });
        },
        []
    );

    const reset = useCallback(() => {
        setLogs([]);
        setResult(null);
        setIsRunning(false);
    }, []);

    return { isRunning, logs, result, runExpedition, reset };
}
