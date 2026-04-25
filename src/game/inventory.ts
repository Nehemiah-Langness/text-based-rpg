import type { InventoryKey as BaseInventoryKey } from './engine/category';
import { InventorySystem } from './engine/inventory-system';
import { Prices } from './prices';
import { Quests } from './quests';

function createTrinket({
    level,
    variance,
    ...passThrough
}: Parameters<typeof InventorySystem.createInventoryItem<'trinket'>>[0] & { level: number; variance: number }) {
    return InventorySystem.createInventoryItem<'trinket'>({
        ...passThrough,
        vendor: {
            wontSell: true,
            ...passThrough.vendor,
            value: Prices.getCombination([
                {
                    amount: level,
                    category: 'trinketBase',
                },
                {
                    amount: variance,
                    category: 'trinketVariance',
                },
            ]),
        },
    });
}

export const Inventory = new InventorySystem({
    coralShard: InventorySystem.createInventoryItem<'currency'>({
        category: 'currency',
        name: 'Coral Shard',
        description: 'The main currency among mermaids.',
    }),
    polishedShellFragment: createTrinket({
        category: 'trinket',
        name: 'Polished Shell Fragment',
        description: 'A smooth, decorative shell piece.',
        level: 0.5,
        variance: 1,
    }),
    crackedPearl: createTrinket({
        category: 'trinket',
        name: 'Cracked Pearl',
        description: 'Slightly flawed but still valuable.',
        level: 0.5,
        variance: 2,
    }),
    coralCharm: createTrinket({
        category: 'trinket',
        name: 'Coral Charm',
        description: 'Simple carved coral pendant.',
        level: 0.5,
        variance: 3,
    }),
    barnacleCoveredCoin: createTrinket({
        category: 'trinket',
        name: 'Barnacle-Covered Coin',
        description: 'Currency from a lost surface ship.',
        level: 0.5,
        variance: 4,
    }),
    wornFinRing: createTrinket({
        category: 'trinket',
        name: 'Worn Fin Ring',
        description: 'Old jewelry with faded engravings.',
        level: 0.5,
        variance: 5,
    }),
    luminousPearl: createTrinket({
        category: 'trinket',
        name: 'Luminous Pearl',
        description: 'Emits a soft glow.',
        level: 1,
        variance: 2,
    }),
    glassBottleMessage: createTrinket({
        category: 'trinket',
        name: 'Glass Bottle Message',
        description: 'Contains partial, cryptic writing.',
        level: 1,
        variance: 3,
    }),
    engravedCoralIdol: createTrinket({
        category: 'trinket',
        name: 'Engraved Coral Idol',
        description: 'Depicts an unknown ocean figure.',
        level: 1,
        variance: 5,
    }),
    silverTideBracelet: createTrinket({
        category: 'trinket',
        name: 'Silver Tide Bracelet',
        description: 'Atlantean-crafted jewelry.',
        level: 1,
        variance: 7,
    }),
    oldNavigationCompass: createTrinket({
        category: 'trinket',
        name: 'Old Navigation Compass',
        description: 'Rusted, but intriguing.',
        level: 1,
        variance: 9,
    }),
    sharkToothTotem: createTrinket({
        category: 'trinket',
        name: 'Shark Tooth Totem',
        description: 'Tribal artifact, valued by collectors.',
        level: 2,
        variance: 5,
    }),
    dolphinCrestMedallion: createTrinket({
        category: 'trinket',
        name: 'Dolphin Crest Medallion',
        description: 'Symbol of high rank.',
        level: 7,
        variance: 5,
    }),
    ancientAtlanteanSigil: createTrinket({
        category: 'trinket',
        name: 'Ancient Atlantean Sigil',
        description: 'Mark of old authority.',
        level: 2,
        variance: 10,
    }),
    tridentFragment: createTrinket({
        category: 'trinket',
        name: 'Trident Fragment',
        description: 'Broken shard from a ceremonial weapon.',
        level: 2,
        variance: 13,
    }),
    velmorasInkVial: createTrinket({
        category: 'trinket',
        name: 'Magical Ink Vial',
        description: 'Still faintly swirling with dark energy.',
        level: 2,
        variance: 16,
    }),
    sealedOrderRelic: createTrinket({
        category: 'trinket',
        name: 'Silent Order Relic',
        description: 'Marked with symbols of the Silent Order.',
        level: 4,
        variance: 5,
    }),
    echoPearl: createTrinket({
        category: 'trinket',
        name: 'Echo Pearl',
        description: 'Replays faint voices when held.',
        level: 4,
        variance: 7,
    }),
    abyssalCoreShard: createTrinket({
        category: 'trinket',
        name: 'Abyssal Core Shard',
        description: 'Pulses with deep-sea energy.',
        level: 4,
        variance: 13,
    }),
    forgottenCrownPiece: createTrinket({
        category: 'trinket',
        name: 'Forgotten Crown Piece',
        description: "Fragment of a lost ruler's crown.",
        level: 4,
        variance: 21,
    }),
    inkSeersBrokenLens: createTrinket({
        category: 'trinket',
        name: "Seer's Broken Lens",
        description: "Once used by a seer and now a collector's item.",
        level: 4,
        variance: 25,
    }),
    friedReefFish: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Fried Reef Fish',
        description: "Fred's specialty.",
        consumable: {
            health: 5,
        },
        vendor: {},
    }),
    kelpWrap: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Kelp Wrap',
        description: 'Light and quick.',
        consumable: {
            stamina: 10,
        },
        vendor: {},
    }),
    seaBerries: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Sea Berries',
        description: 'Who knew you could find berries in the ocean.',
        consumable: {
            stamina: 10,
            health: 5,
        },
        vendor: {},
    }),
    saltedMinnowStrips: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Salted Minnow Strips',
        description: 'The perfect food for an on-the-go go-getter.',
        consumable: {
            stamina: 15,
        },
        vendor: {},
    }),
    spicedFishPlatter: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Spiced Fish Platter',
        description: 'Spicy.  Just the way you like it.',
        consumable: {
            health: 20,
            stamina: 10,
        },
        vendor: {},
    }),
    kelpNoodleBowl: InventorySystem.createInventoryItem({
        category: 'food' as const,
        name: 'Kelp Noodle Bowl',
        description: 'Put the kelp in the bowl and call it a noodle.',
        consumable: {
            stamina: 20,
            effects: [
                {
                    effect: 'stamina-regen-low',
                    duration: 5,
                },
            ],
        },
        vendor: {},
    }),
    coralFruitMedley: InventorySystem.createInventoryItem({
        category: 'food' as const,
        name: 'Coral Fruit Medley',
        description: 'For the balanced diet.',
        consumable: {
            health: 25,
            stamina: 25,
        },
        vendor: {},
    }),
    herbalBroth: InventorySystem.createInventoryItem({
        category: 'food' as const,
        name: 'Herbal Broth',
        description: 'Herbal remedies for the non-herbal tragedies.',
        consumable: {
            health: 5,
            effects: [
                {
                    effect: 'health-regen-low',
                    duration: 5,
                },
            ],
        },
        vendor: {},
    }),
    grilledSharkFillet: InventorySystem.createInventoryItem({
        category: 'food-fine' as const,
        name: 'Grilled Shark Fillet',
        description: 'Big food from a bigger fish.',
        consumable: {
            stamina: 40,
            health: 75,
        },
        vendor: {},
    }),
    searedAbyssalFillet: InventorySystem.createInventoryItem({
        category: 'food-fine' as const,
        name: 'Seared Abyssal Fillet',
        description: 'A fine fish fillet, seared to perfection and served with a kelp salad.',
        consumable: {
            health: 75,
            effects: [
                {
                    duration: 5,
                    effect: 'strength',
                },
            ],
        },
        vendor: {},
    }),
    pearlGlazedKelpWrap: InventorySystem.createInventoryItem({
        category: 'food-fine' as const,
        name: 'Pearl Glazed Kelp Wrap',
        description: 'The finest wrap for the finest mermaid.',
        consumable: {
            stamina: 75,
            effects: [
                {
                    duration: 5,
                    effect: 'speed',
                },
            ],
        },
        vendor: {},
    }),
    abyssalStew: InventorySystem.createInventoryItem({
        category: 'food-fine' as const,
        name: 'Abyssal Stew',
        description: "Stew darker than Velmora's ink.  And hopefully does not contain Velmora's ink.",
        consumable: {
            health: 75,
            effects: [
                {
                    effect: 'stamina-regen-med',
                    duration: 5,
                },
            ],
        },
        vendor: {},
    }),
    goldenReefPlatter: InventorySystem.createInventoryItem({
        category: 'food-fine' as const,
        name: 'Golden Reef Platter',
        description: "Stew darker than Velmora's ink.  And hopefully does not contain Velmora's ink.",
        consumable: {
            health: 80,
            stamina: 80,
        },
        vendor: {},
    }),
    deepCurrentElixir: InventorySystem.createInventoryItem({
        category: 'potion' as const,
        name: 'Deep Current Elixir',
        description: 'An elixir that grants you the speed of the deepest currents.',
        consumable: {
            stamina: 50,
            effects: [
                {
                    duration: 5,
                    effect: 'speed',
                },
                {
                    duration: 5,
                    effect: 'stamina-regen-high',
                },
            ],
        },
        vendor: {},
    }),
    bloomTonic: InventorySystem.createInventoryItem({
        category: 'potion' as const,
        name: 'Bloom Tonic',
        description: 'Tonic that packs a punch.',
        consumable: {
            health: 50,
            effects: [
                {
                    duration: 5,
                    effect: 'strength',
                },
                {
                    duration: 5,
                    effect: 'health-regen-high',
                },
            ],
        },
        vendor: {},
    }),
    seaCucumberCream: InventorySystem.createInventoryItem<'ointment'>({
        category: 'ointment',
        name: "Nerissa's Sea-Salt and Sea-Cucumber Ointment",
        description: "Apply it before a fight.  You'll feel the difference.",
        equippable: {
            defense: 5,
        },
    }),
    healthBreastplateEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Health (Chest Armor)',
        description: 'A small red gem emitting a faint glow.  It can be attached to chest armor to make you more resilient in battle.',
        equippable: {
            subCategory: 'chest' as const,
            health: 40,
            requirement: {
                category: 'armor',
                subCategory: 'chest',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    healthHelmetEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Health (Head Armor)',
        description: 'A small red gem emitting a faint glow.  It can be attached to chest armor to make you more resilient in battle.',
        equippable: {
            subCategory: 'head' as const,
            health: 30,
            requirement: {
                category: 'armor',
                subCategory: 'head',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    healthArmsEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Health (Arm Armor)',
        description:
            'A small red gem emitting a faint glow.  It can be attached to arm or hand armor to make you more resilient in battle.',
        equippable: {
            subCategory: 'arm' as const,
            health: 30,
            requirement: {
                category: 'armor',
                subCategory: 'arm',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    staminaBreastplateEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Stamina (Chest Armor)',
        description: 'A small green gem emitting a faint glow.  It can be attached to chest armor to keep you energized in battle.',
        equippable: {
            subCategory: 'chest' as const,
            stamina: 50,
            requirement: {
                category: 'armor',
                subCategory: 'chest',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    staminaHelmetEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Stamina (Head Armor)',
        description: 'A small green gem emitting a faint glow.  It can be attached to chest armor to keep you energized in battle.',
        equippable: {
            subCategory: 'head' as const,
            stamina: 25,
            requirement: {
                category: 'armor',
                subCategory: 'head',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    staminaArmsEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Stamina (Arm Armor)',
        description: 'A small green gem emitting a faint glow.  It can be attached to arm or hand armor to keep you energized in battle.',
        equippable: {
            subCategory: 'arm' as const,
            stamina: 25,
            requirement: {
                category: 'armor',
                subCategory: 'arm',
                type: 'equipped',
            },
        },
        vendor: {
            wontBuy: true,
            max: 1,
        },
    }),
    ringOfProtection: InventorySystem.createInventoryItem({
        category: 'enchanted-armor' as const,
        name: 'Ring of Protection',
        description: 'A small ring emitting a steady hum of energy.',
        equippable: {
            subCategory: 'hand' as const,
            defense: 3,
        },
        vendor: {
            max: 1,
        },
        onAdd: () => {
            if (Quests.getStage('mainQuest') === 'get-requirement-to-fix-crown') {
                return Quests.progress('mainQuest', 'get-requirement-to-fix-crown');
            }
            return null;
        },
        onRemove: () => {
            if (Quests.getStage('mainQuest') === 'fix-crown') {
                return Quests.revertTo('mainQuest', 'get-requirement-to-fix-crown');
            }
            return null;
        },
    }),
    ringOfLongevity: InventorySystem.createInventoryItem({
        category: 'enchanted-armor' as const,
        name: 'Ring of Longevity',
        description: 'A small ring emitting a steady hum of energy.',
        equippable: {
            subCategory: 'hand' as const,
            health: 10,
        },
        vendor: {
            max: 1,
        },
    }),
    ringOfSpeed: InventorySystem.createInventoryItem({
        category: 'enchanted-armor' as const,
        name: 'Ring of Swiftness',
        description: 'A small ring emitting a steady hum of energy.',
        equippable: {
            subCategory: 'hand' as const,
            speed: 30,
        },
        vendor: {
            max: 1,
        },
    }),
    ringOfStrength: InventorySystem.createInventoryItem({
        category: 'enchanted-armor' as const,
        name: 'Ring of Strength',
        description: 'A small ring emitting a steady hum of energy.',
        equippable: {
            subCategory: 'hand' as const,
            strength: 1,
        },
        vendor: {
            max: 1,
        },
    }),
    ringOfEnergy: InventorySystem.createInventoryItem({
        category: 'enchanted-armor' as const,
        name: 'Ring of Energy',
        description: 'A small ring emitting a steady hum of energy.',
        equippable: {
            subCategory: 'hand' as const,
            stamina: 30,
        },
        vendor: {
            max: 1,
        },
    }),
    sharkskinBreastplateEnchantment: createArmor({
        level: 1,
        type: 'chest',
        name: 'Sharkskin Breastplate',
        description: 'Tough, layered shark hide that hardens under pressure.',
    }),
    sharkskinHelmetEnchantment: createArmor({
        level: 1,
        type: 'head',
        name: 'Sharkskin Helmet',
        description: 'Tough, layered shark hide that hardens under pressure.',
    }),
    sharkskinArmsEnchantment: createArmor({
        level: 1,
        type: 'arm',
        name: 'Sharkskin Gauntlets',
        description: 'Tough, layered shark hide that hardens under pressure.',
    }),
    kelpWeaveBreastplateArmor: createArmor({
        level: 2,
        type: 'chest',
        name: 'Kelpweave Breastplate',
        description:
            'Tightly braided strands of reinforced kelp, layered for flexibility. It moves effortlessly with ocean currents, making it ideal for agile fighters.',
    }),
    kelpWeaveHelmetArmor: createArmor({
        level: 2,
        type: 'head',
        name: 'Kelpweave Helmet',
        description:
            'Tightly braided strands of reinforced kelp, layered for flexibility. It moves effortlessly with ocean currents, making it ideal for agile fighters.',
    }),
    kelpWeaveArmsArmor: createArmor({
        level: 2,
        type: 'arm',
        name: 'Kelpweave Gauntlets',
        description:
            'Tightly braided strands of reinforced kelp, layered for flexibility. It moves effortlessly with ocean currents, making it ideal for agile fighters.',
    }),
    shellBreastplateArmor: createArmor({
        level: 2.5,
        type: 'chest',
        name: 'Turtle Shell Breastplate',
        description: 'Heavy, reinforced plating formed from ancient turtle shells. Built for endurance, not speed.',
    }),
    shellHelmetArmor: createArmor({
        level: 2.5,
        type: 'head',
        name: 'Turtle Shell Helmet',
        description: 'Heavy, reinforced plating formed from ancient turtle shells. Built for endurance, not speed.',
    }),
    shellArmsArmor: createArmor({
        level: 2.5,
        type: 'arm',
        name: 'Turtle Shell Gauntlets',
        description: 'Heavy, reinforced plating formed from ancient turtle shells. Built for endurance, not speed.',
    }),
    cragscaleBreastplateArmor: createArmor({
        level: 3,
        type: 'chest',
        name: 'Cragscale Breastplate',
        description: 'Forged from hardened scales and mineral deposits found along deep-sea rock formations. Rough, jagged, and built to endure crushing pressure.',
    }),
    cragscaleHelmetArmor: createArmor({
        level: 3,
        type: 'head',
        name: 'Cragscale Helmet',
        description: 'Forged from hardened scales and mineral deposits found along deep-sea rock formations. Rough, jagged, and built to endure crushing pressure.',
    }),
    cragscaleArmsArmor: createArmor({
        level: 3,
        type: 'arm',
        name: 'Cragscale Gauntlets',
        description: 'Forged from hardened scales and mineral deposits found along deep-sea rock formations. Rough, jagged, and built to endure crushing pressure.',
    }),
    coralBreastplateArmor: createArmor({
        level: 4,
        type: 'chest',
        name: 'Woven Coral Breastplate',
        description: 'Lightweight armor crafted from flexible coral strands.',
    }),
    coralHelmetArmor: createArmor({
        level: 4,
        type: 'head',
        name: 'Woven Coral Helmet',
        description: 'Lightweight armor crafted from flexible coral strands.',
    }),
    coralArmsArmor: createArmor({
        level: 4,
        type: 'arm',
        name: 'Woven Coral Gauntlets',
        description: 'Lightweight armor crafted from flexible coral strands.',
    }),
    leviathanBreastplateArmor: createArmor({
        level: 5,
        type: 'chest',
        name: 'Leviathan Bone Breastplate',
        description: 'Crafted from the remains of ancient sea titans. Feels heavy with history and power.',
    }),
    leviathanHelmetArmor: createArmor({
        level: 5,
        type: 'head',
        name: 'Leviathan Bone Helmet',
        description: 'Crafted from the remains of ancient sea titans. Feels heavy with history and power.',
    }),
    leviathanArmsArmor: createArmor({
        level: 5,
        type: 'arm',
        name: 'Leviathan Bone Gauntlets',
        description: 'Crafted from the remains of ancient sea titans. Feels heavy with history and power.',
    }),
    abyssalBreastplateArmor: createArmor({
        level:6,
        type: 'chest',
        name: 'Abyssal Guard Breastplate',
        description: 'Forged in the darkest depths, the finest armor in the ocean.',
    }),
    abyssalHelmetArmor: createArmor({
        level: 6,
        type: 'head',
        name: 'Abyssal Guard Helmet',
        description: 'Forged in the darkest depths, the finest armor in the ocean.',
    }),
    abyssalArmsArmor: createArmor({
        level: 6,
        type: 'arm',
        name: 'Abyssal Guard Gauntlets',
        description: 'Forged in the darkest depths, the finest armor in the ocean.',
    }),
});

function createArmor({
    level,
    type,
    ...passThrough
}: Partial<Parameters<typeof InventorySystem.createInventoryItem<'armor'>>[0]> &
    Pick<Parameters<typeof InventorySystem.createInventoryItem<'armor'>>[0], 'name'> & { level: number; type: 'arm' | 'head' | 'chest' }) {
    return InventorySystem.createInventoryItem({
        ...passThrough,
        category: 'armor' as const,
        equippable: {
            subCategory: type,
            defense: calculateDefense(level, type),
        },
        vendor: {
            ...passThrough.vendor,
            max: 1,
        },
    });
}

function calculateDefense(level: number, type: 'arm' | 'head' | 'chest') {
    const targetDamage = 8 * level;
    const damageEffectiveness = [
        'arm',
        'arm',
        'arm',
        'head',
        'head',
        'head',
        'head',
        'chest',
        'chest',
        'chest',
        'chest',
        'chest',
        'chest',
    ] as (typeof type)[];
    return Math.max(1, Math.floor((targetDamage * damageEffectiveness.filter((x) => x === type).length) / damageEffectiveness.length));
}

export type InventoryKey = BaseInventoryKey<typeof Inventory>;
