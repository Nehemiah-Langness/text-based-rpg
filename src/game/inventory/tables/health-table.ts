import type { EquipmentCategories } from '../types/equipment-categories';

export const HealthTable: Record<EquipmentCategories['consumables'][number], number> = {
    Bandage: 10,
    Splint: 30,
    'Herbal Medicine': 40,
    'Antibacterial Paste': 80,
};
