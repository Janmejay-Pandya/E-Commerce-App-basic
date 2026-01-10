import { Plus, Minus, Trash2 } from "lucide-react";
import useCartStore from "../store/cartStore";
import api from "../services/api";

export default function Cart() {
    const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

    const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

    const checkout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        try {
            await api.post("/order", {
                products: cart.map((p) => ({
                    product: p._id,
                    quantity: p.qty
                })),
                totalAmount: total
            });
            clearCart();
            alert("Order placed successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to place order. Please try again.");
            console.error(err);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Start adding some products to your cart!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Checkout</h2>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold">Order Summary</h3>
                    </div>
                    {cart.map((item) => (
                        <div key={item._id} className="border-b border-gray-200 last:border-0 p-6 hover:bg-gray-50 transition">
                            <div className="flex gap-6 items-center">
                                <img
                                    src={item.image || "https://via.placeholder.com/100x100?text=No+Image"}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold mb-1">{item.name}</h4>
                                    <p className="text-gray-500 text-sm">Price per item: ₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => decreaseQuantity(item._id)}
                                            className="p-2 hover:bg-gray-100 transition rounded-l-lg"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{item.qty}</span>
                                        <button
                                            onClick={() => increaseQuantity(item._id)}
                                            className="p-2 hover:bg-gray-100 transition rounded-r-lg"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[120px]">
                                        <p className="text-xl font-bold text-indigo-600">₹{item.price * item.qty}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition rounded-lg"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-semibold text-gray-700">Total Amount:</span>
                        <span className="text-3xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={checkout}
                        className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
