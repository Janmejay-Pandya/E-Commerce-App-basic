import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { useState } from "react";
import useCartStore from "../store/cartStore";


export default function ProductCard({ product }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [isLiked, setIsLiked] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product);

        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    // Generate random rating for demo (you can replace with actual product rating)
    const rating = product.rating || 4.5;
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-slate-200">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-slate-50">
                {/* Wishlist Button */}
                <button
                    onClick={handleLike}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                >
                    <Heart
                        size={18}
                        className={`transition-all duration-300 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-600"
                            }`}
                    />
                </button>

                {/* Discount Badge (if applicable) */}
                {product.discount && (
                    <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {product.discount}% OFF
                    </div>
                )}

                {/* Product Image */}
                <img
                    src={product.image || null}
                    alt={product.name}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = null;
                    }}
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105">
                        <Eye size={18} />
                        Quick View
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                {/* Category or Brand (optional) */}
                {product.category && (
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        {product.category}
                    </p>
                )}

                {/* Product Name */}
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1 mb-2 group-hover:text-slate-700 transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                    </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < Math.floor(rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{rating}</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                        <p className="text-slate-900 font-bold text-2xl">
                            ₹{product.price}
                        </p>
                        {product.originalPrice && (
                            <p className="text-slate-400 text-sm line-through">
                                ₹{product.originalPrice}
                            </p>
                        )}
                    </div>

                    {/* Stock Indicator */}
                    {product.stock !== undefined && (
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? "bg-emerald-500" :
                                product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                                }`}></div>
                            <span className="text-xs text-slate-500">
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || (product.stock !== undefined && product.stock === 0)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isAdding
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                        }`}
                >
                    {isAdding ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Added to Cart!
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={18} strokeWidth={2.5} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}