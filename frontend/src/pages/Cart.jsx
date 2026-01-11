import { Plus, Minus, Trash2, ShoppingBag, Package, CreditCard, ArrowRight, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import api from "../services/api";

export default function Cart() {
    const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    const checkout = async () => {
        if (cart.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }
        setIsProcessing(true);
        try {
            await api.post("/order", {
                products: cart.map((p) => ({
                    product: p._id,
                    quantity: p.qty
                })),
                totalAmount: total
            });
            clearCart();
            toast.success("Order placed successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-200">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-slate-400" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-slate-900">Your Cart is Empty</h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            <ShoppingBag size={20} />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
                    <p className="text-slate-600">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Free Shipping Banner */}
                        {subtotal < 500 && (
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                                <Truck size={24} className="flex-shrink-0" />
                                <p className="text-sm font-medium">
                                    Add ₹{(500 - subtotal).toFixed(2)} more to get <strong>FREE SHIPPING!</strong>
                                </p>
                            </div>
                        )}

                        {/* Cart Items List */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                            {cart.map((item, index) => (
                                <div
                                    key={item._id}
                                    className={`p-6 ${index !== cart.length - 1 ? 'border-b border-slate-200' : ''
                                        } hover:bg-slate-50 transition-colors`}
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item.image || "https://via.placeholder.com/120x120?text=No+Image"}
                                                alt={item.name}
                                                className="w-28 h-28 object-cover rounded-xl border border-slate-200"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/120x120?text=No+Image";
                                                }}
                                            />
                                            {item.discount && (
                                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    -{item.discount}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="text-sm text-slate-500 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-slate-600 font-medium">Quantity:</span>
                                                    <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => decreaseQuantity(item._id)}
                                                            className="p-2 hover:bg-slate-100 transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={16} className="text-slate-600" />
                                                        </button>
                                                        <span className="px-4 py-2 font-bold text-slate-900 min-w-[3rem] text-center bg-slate-50">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            onClick={() => increaseQuantity(item._id)}
                                                            className="p-2 hover:bg-slate-100 transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={16} className="text-slate-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 mb-1">
                                                        ₹{item.price} × {item.qty}
                                                    </p>
                                                    <p className="text-2xl font-bold text-slate-900">
                                                        ₹{(item.price * item.qty).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-4">
                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl">
                                    <Package size={22} className="text-slate-700" />
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-slate-900">Total</span>
                                            <span className="text-3xl font-bold text-slate-900">
                                                ₹{total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={checkout}
                                    disabled={isProcessing}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={22} />
                                            Proceed to Checkout
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Security Badge */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">Secure Checkout</p>
                                        <p className="text-xs text-emerald-700">Your payment info is safe with us</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}