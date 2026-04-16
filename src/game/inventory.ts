import type { InventoryKey as BaseInventoryKey } from './engine/category';
import { InventorySystem } from './engine/inventory-system';

export const Inventory = new InventorySystem({
    coralShard: InventorySystem.createInventoryItem<'currency'>({
        category: 'currency',
        name: 'Coral Shard',
        description: 'The main currency among mermaids.',
        count: 1444
    }),
    polishedShellFragment: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Polished Shell Fragment',
        description: 'A smooth, decorative shell piece.',
        vendor: {
            value: 5,
        },
    }),
    crackedPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Cracked Pearl',
        description: 'Slightly flawed but still valuable.',
        vendor: {
            value: 7,
        },
    }),
    coralCharm: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Coral Charm',
        description: 'Simple carved coral pendant.',
        vendor: {
            value: 10,
        },
    }),
    barnacleCoveredCoin: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Barnacle-Covered Coin',
        description: 'Currency from a lost surface ship.',
        vendor: {
            value: 13,
        },
    }),
    wornFinRing: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Worn Fin Ring',
        description: 'Old jewelry with faded engravings.',
        vendor: {
            value: 16,
        },
    }),
    luminousPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Luminous Pearl',
        description: 'Emits a soft glow.',
        vendor: {
            value: 53,
        },
    }),
    glassBottleMessage: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Glass Bottle Message',
        description: 'Contains partial, cryptic writing.',
        vendor: {
            value: 57,
        },
    }),
    engravedCoralIdol: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Engraved Coral Idol',
        description: 'Depicts an unknown ocean figure.',
        vendor: {
            value: 62,
        },
    }),
    silverTideBracelet: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Silver Tide Bracelet',
        description: 'Atlantean-crafted jewelry.',
        vendor: {
            value: 65,
        },
    }),
    oldNavigationCompass: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Old Navigation Compass',
        description: 'Rusted, but intriguing.',
        vendor: {
            value: 72,
        },
    }),
    sharkToothTotem: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Shark Tooth Totem',
        description: 'Tribal artifact, valued by collectors.',
        vendor: {
            value: 127,
        },
    }),
    dolphinCrestMedallion: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Dolphin Crest Medallion',
        description: 'Symbol of high rank.',
        vendor: {
            value: 142,
        },
    }),
    ancientAtlanteanSigil: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Ancient Atlantean Sigil',
        description: 'Mark of old authority.',
        vendor: {
            value: 164,
        },
    }),
    tridentFragment: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Trident Fragment',
        description: 'Broken shard from a ceremonial weapon.',
        vendor: {
            value: 173,
        },
    }),
    velmorasInkVial: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: "Velmora's Ink Vial",
        description: 'Still faintly swirling with dark energy.',
        vendor: {
            value: 192,
        },
    }),
    sealedOrderRelic: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Silent Order Relic',
        description: 'Marked with symbols of the Silent Order.',
        vendor: {
            value: 463,
        },
    }),
    echoPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Echo Pearl',
        description: 'Replays faint voices when held.',
        vendor: {
            value: 485,
        },
    }),
    abyssalCoreShard: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Abyssal Core Shard',
        description: 'Pulses with deep-sea energy.',
        vendor: {
            value: 489,
        },
    }),
    forgottenCrownPiece: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Forgotten Crown Piece',
        description: "Fragment of a lost ruler's crown.",
        vendor: {
            value: 512,
        },
    }),
    inkSeersBrokenLens: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: "Ink-Seer's Broken Lens",
        description: 'Once used by Velmora to "see truth".',
        vendor: {
            value: 531,
        },
    }),
    friedReefFish: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Fried Reef Fish',
        description: "Fred's specialty.",
        consumable: {
            health: 5,
        },
        vendor: {
            value: 6,
        },
    }),
    kelpWrap: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Kelp Wrap',
        description: 'Light and quick.',
        consumable: {
            stamina: 10,
        },
        vendor: {
            value: 13,
        },
    }),
    seaBerries: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Sea Berries',
        description: 'Who knew you could find berries in the ocean.',
        consumable: {
            stamina: 10,
            health: 5,
        },
        vendor: {
            value: 17,
        },
    }),
    saltedMinnowStrips: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Salted Minnow Strips',
        description: 'The perfect food for an on-the-go go-getter.',
        consumable: {
            stamina: 15,
        },
        vendor: {
            value: 16,
        },
    }),
    spicedFishPlatter: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Spiced Fish Platter',
        description: 'Spicy.  Just the way you like it.',
        consumable: {
            health: 20,
            stamina: 10,
        },
        vendor: {
            value: 26,
        },
        count: 2,
    }),
    kelpNoodleBowl: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Kelp Noodle Bowl',
        description: 'Put the kelp in the bowl and call it a noodle.',
        consumable: {
            stamina: 45,
            effects: [
                {
                    effect: 'stamina-regen-low',
                    duration: 5,
                },
            ],
        },
        vendor: {
            value: 48,
        },
        count: 1,
    }),
    coralFruitMedley: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Coral Fruit Medley',
        description: 'For the balanced diet.',
        consumable: {
            stamina: 30,
            health: 30,
        },
        vendor: {
            value: 65,
        },
    }),
    herbalBroth: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Herbal Broth',
        description: 'Herbal remedies for the non-herbal tragedies.',
        consumable: {
            health: 40,
            effects: [
                {
                    effect: 'health-regen-low',
                    duration: 5,
                },
            ],
        },
        vendor: {
            value: 48,
        },
    }),
    grilledSharkFillet: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Grilled Shark Fillet',
        description: 'Big food from a bigger fish.',
        consumable: {
            stamina: 40,
            health: 75,
        },
        vendor: {
            value: 125,
        },
    }),
    abyssalStew: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
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
        vendor: {
            value: 90,
        },
    }),
    goldenReefPlatter: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
        name: 'Golden Reef Platter',
        description: "Stew darker than Velmora's ink.  And hopefully does not contain Velmora's ink.",
        consumable: {
            health: 80,
            stamina: 80,
        },
        vendor: {
            value: 194,
        },
    }),
    deepCurrentElixir: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
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
        vendor: {
            value: 194,
        },
    }),
    bloomTonic: InventorySystem.createInventoryItem<'food'>({
        category: 'food',
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
        vendor: {
            value: 194,
        },
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
        description: 'An enchantment that makes you more resilient in battle.',
        equippable: {
            subCategory: 'breastplate' as const,
            health: 40,
        },
        vendor: {
            value: 523,
            wontBuy: true,
            max: 1,
        },
    }),
    healthHelmetEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Health (Head Armor)',
        description: 'An enchantment that makes you more resilient in battle.',
        equippable: {
            subCategory: 'helmet' as const,
            health: 30,
        },
        vendor: {
            value: 367,
            wontBuy: true,
            max: 1,
        },
    }),
    healthArmsEnchantment: InventorySystem.createInventoryItem<'enchantment'>({
        category: 'enchantment',
        name: 'Increased Health (Arm Armor)',
        description: 'An enchantment that makes you more resilient in battle.',
        equippable: {
            subCategory: 'arm' as const,
            health: 30,
        },
        vendor: {
            value: 367,
            wontBuy: true,
            max: 1,
        },
    }),
});

export type InventoryKey = BaseInventoryKey<typeof Inventory>;
