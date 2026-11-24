import { describe, expect, it } from "vitest";

import {
  addCartItem,
  getCartItemCount,
  getCartSubtotal,
  setCartQuantity,
  type CartLineItem,
} from "@/lib/storefront-cart";

describe("storefront cart totals", () => {
  it("calculates subtotal for the demo ghee and honey prices", () => {
    const items: CartLineItem[] = [
      { productId: "ghee", title: "Badri Cow Desi Ghee", price: 1450, quantity: 1 },
      { productId: "honey", title: "Organic Honey", price: 240, quantity: 2 },
    ];

    expect(getCartSubtotal(items)).toBe(1930);
  });

  it("counts each item quantity and increments an existing product", () => {
    const first = addCartItem([], { productId: "honey", title: "Organic Honey", price: 240 });
    const second = addCartItem(first, {
      productId: "honey",
      title: "Organic Honey",
      price: 240,
    });

    expect(getCartItemCount(second)).toBe(2);
    expect(getCartSubtotal(second)).toBe(480);
  });

  it("removes a cart line when its quantity reaches zero", () => {
    const items: CartLineItem[] = [
      { productId: "honey", title: "Organic Honey", price: 240, quantity: 1 },
    ];

    expect(setCartQuantity(items, "honey", 0)).toEqual([]);
  });
});