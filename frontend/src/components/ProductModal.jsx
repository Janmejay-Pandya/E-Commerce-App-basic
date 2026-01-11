import { X, ShoppingBag, Heart, Star, Package, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";

export default function ProductModal({ product, isOpen, onClose }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [isLiked, setIsLiked] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Handle Escape key and body scroll
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            // Handle Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            
            return () => {
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', handleEscape);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const rating = product.rating || 4.5;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        toast.success(`${product.name} added to cart!`);

        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Blurred Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                    aria-label="Close modal"
                >
                    <X size={24} className="text-slate-700" />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Side - Product Image */}
                    <div className="relative bg-slate-50 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                        {/* Wishlist Button */}
                        <button
                            onClick={handleLike}
                            className="absolute top-4 left-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                        >
                            <Heart
                                size={20}
                                className={`transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-slate-600"
                                    }`}
                            />
                        </button>

                        {/* Discount Badge */}
                        {product.discount && (
                            <div className="absolute top-4 right-16 z-10 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                {product.discount}% OFF
                            </div>
                        )}

                        {/* Product Image */}
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-8"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <Package size={80} />
                                <p className="mt-4 text-lg">No Image Available</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                        {/* Category */}
                        {product.category && (
                            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
                                {product.category}
                            </p>
                        )}

                        {/* Product Name */}
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {product.name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < Math.floor(rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-semibold text-slate-700">{rating}</span>
                            <span className="text-slate-500">(128 reviews)</span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6 pb-6 border-b border-slate-200">
                            <div className="flex items-baseline gap-3 mb-2">
                                <p className="text-4xl font-bold text-slate-900">
                                    ₹{product.price}
                                </p>
                                {product.originalPrice && (
                                    <p className="text-xl text-slate-400 line-through">
                                        ₹{product.originalPrice}
                                    </p>
                                )}
                            </div>
                            {product.discount && (
                                <p className="text-sm text-emerald-600 font-semibold">
                                    You save ₹{((product.originalPrice - product.price).toFixed(2))} ({product.discount}% off)
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Stock Status */}
                        {product.stock !== undefined && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? "bg-emerald-500" :
                                        product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                                        }`}></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </p>
                                        {product.stock > 0 && (
                                            <p className="text-sm text-slate-600">
                                                {product.stock} units available
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features/Highlights */}
                        <div className="mb-8 space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <p className="text-slate-700">Free shipping on orders over ₹500</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <p className="text-slate-700">30-day return policy</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <p className="text-slate-700">Secure payment options</p>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || (product.stock !== undefined && product.stock === 0)}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${isAdding
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                                }`}
                        >
                            {isAdding ? (
                                <>
                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Added to Cart!
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={22} strokeWidth={2.5} />
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
