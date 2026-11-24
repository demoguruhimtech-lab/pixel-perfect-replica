export interface CartLineItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CartProduct {
  productId: string;
  title: string;
  price: number;
}

export function addCartItem(items: CartLineItem[], product: CartProduct): CartLineItem[] {
  const existing = items.find((item) => item.productId === product.productId);

  if (existing) {
    return items.map((item) =>
      item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...items, { ...product, quantity: 1 }];
}

export function setCartQuantity(
  items: CartLineItem[],
  productId: string,
  quantity: number,
): CartLineItem[] {
  if (quantity <= 0) {
    return items.filter((item) => item.productId !== productId);
  }

  return items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
}

export function removeCartItem(items: CartLineItem[], productId: string): CartLineItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function getCartItemCount(items: CartLineItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(items: CartLineItem[]): number {
  return items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}