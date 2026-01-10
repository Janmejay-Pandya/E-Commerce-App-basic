import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((p) => p._id === product._id);
      if (exists) {
        return {
          cart: state.cart.map((p) =>
            p._id === product._id ? { ...p, qty: p.qty + 1 } : p
          )
        };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    }),

  increaseQuantity: (productId) =>
    set((state) => ({
      cart: state.cart.map((p) =>
        p._id === productId ? { ...p, qty: p.qty + 1 } : p
      )
    })),

  decreaseQuantity: (productId) =>
    set((state) => {
      const item = state.cart.find((p) => p._id === productId);
      if (item && item.qty > 1) {
        return {
          cart: state.cart.map((p) =>
            p._id === productId ? { ...p, qty: p.qty - 1 } : p
          )
        };
      }
      // If quantity is 1, remove from cart
      return {
        cart: state.cart.filter((p) => p._id !== productId)
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((p) => p._id !== productId)
    })),

  clearCart: () => set({ cart: [] })
}));

export default useCartStore;
