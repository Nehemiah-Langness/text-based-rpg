import type { InventoryItem, InventoryItemMeta } from '../inventory/types/inventory-item';
import type { Category } from './category';
import type { InventoryConstraint, InventorySystem } from './inventory-system';
import type { Room } from './room';

export class Store<T extends InventoryConstraint<T> = Record<string, InventoryItem<Category<string>>>> {
    private filter: (item: InventoryItemMeta<Category<T>>) => boolean;
    private inventory: InventorySystem<T>;
    private priceModifier: number;
    openShopText: string;
    leaveStoreText: string;
    firstEntrance?: string | string[];
    private shopText: (room: Room) => string | string[];
    private currentShopRemark = 0;

    constructor(
        inventory: InventorySystem<T>,
        filter: (item: InventoryItemMeta<Category<T>>) => boolean,
        settings: {
            priceModifier: number;
            openShopText: string;
            leaveStoreText: string;
            shopText: (room: Room) => string | string[];
            firstEntrance?: | string[];
        }
    ) {
        this.inventory = inventory;
        this.filter = filter;
        this.priceModifier = settings.priceModifier;
        this.openShopText = settings.openShopText;
        this.shopText = settings.shopText;
        this.leaveStoreText = settings.leaveStoreText;
        this.firstEntrance = settings.firstEntrance
    }

    public getShopText(room: Room) {
        const text = this.shopText(room);
        if (typeof text === 'string') return text;

        const current = this.currentShopRemark % text.length;
        this.currentShopRemark = (this.currentShopRemark + 1) % text.length;

        return text[current];
    }

    public getItemsToSell() {
        return this.inventory
            .list(
                (item) => !!item.vendor && !item.vendor.wontSell && (typeof item.vendor.max === 'undefined' || item.count < item.vendor.max)
            )
            .filter(({ item }) => this.filter(item))
            .map(({ item, key }) => ({
                itemKey: key,
                item: item,
                price: Math.ceil((item.vendor?.value ?? 0) * this.priceModifier),
            }));
    }

    public getItemsToBuy() {
        return this.inventory
            .list((item) => !!item.vendor && !item.vendor.wontBuy && item.count > 0)
            .filter(({ item }) => this.filter(item))
            .map(({ item, key }) => ({
                itemKey: key,
                item: item,
                price: Math.floor((item.vendor?.value ?? 0) / this.priceModifier),
            }));
    }
}
