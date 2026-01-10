import { ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";

export default function ProductCard({ product }) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
        // Optional: Show a brief notification
        const button = document.activeElement;
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = "✓ Added!";
            button.classList.add("bg-green-600");
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove("bg-green-600");
            }, 1000);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 transform hover:-translate-y-1">
            <img
                src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={product.name}
                className="h-48 w-full object-cover rounded-lg mb-3"
                onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
            />

            <h3 className="mt-2 font-semibold text-lg line-clamp-1">{product.name}</h3>
            {product.description && (
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
            )}
            <p className="text-indigo-600 font-bold text-xl mt-2">₹{product.price}</p>

            <button
                onClick={handleAddToCart}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                <ShoppingBag size={16} /> Add to Cart
            </button>
        </div>
    );
}
