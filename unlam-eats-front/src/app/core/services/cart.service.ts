import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  restaurantId: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'unlam-eats-cart';
  private readonly itemsSig = signal<CartItem[]>(this.load());

  readonly items = this.itemsSig.asReadonly();
  readonly total = computed(() => this.itemsSig().reduce((acc, i) => acc + i.price * i.quantity, 0));
  readonly count = computed(() => this.itemsSig().reduce((acc, i) => acc + i.quantity, 0));
  readonly restaurantId = computed(() => this.itemsSig()[0]?.restaurantId ?? null);

  add(item: CartItem) {
    const items = [...this.itemsSig()];
    const idx = items.findIndex(x => x.menuItemId === item.menuItemId && x.restaurantId === item.restaurantId);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
    } else {
      items.push(item);
    }
    this.itemsSig.set(items);
    this.save();
  }

  remove(menuItemId: number) {
    this.itemsSig.set(this.itemsSig().filter(i => i.menuItemId !== menuItemId));
    this.save();
  }

  clear() {
    this.itemsSig.set([]);
    this.save();
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itemsSig()));
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
