import { useEffect, useState } from "react";
import { Plus, Package, ShoppingBag, X, Check, ImagePlus, Loader, Edit, Trash2, User, TrendingUp, Eye, Search } from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: ""
    });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/order");
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get("/prod");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.warning("Please upload an image");
            return;
        }

        try {
            setUploading(true);

            const imageUrl = await uploadToCloudinary(imageFile);

            await api.post("/prod", {
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                stock: Number(formData.stock) || 0
            });

            toast.success("Product added successfully");

            setFormData({ name: "", description: "", price: "", stock: "", category: "" });
            setImageFile(null);
            setImagePreview(null);
            setShowAddProduct(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add product");
        } finally {
            setUploading(false);
        }
    };
    // Filter products
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-slate-900 text-white shadow-xl">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
                            <p className="text-slate-300 text-sm">Manage your products and orders</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg mb-6 border border-slate-200 overflow-hidden">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "overview"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <TrendingUp size={20} className="inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("products")}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "products"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Package size={20} className="inline mr-2" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === "orders"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <ShoppingBag size={20} className="inline mr-2" />
                            Orders
                        </button>
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Orders</h3>
                            <div className="space-y-3">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                                <User size={18} className="text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{order.user?.name || "Guest"}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{order.totalAmount}</p>
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Top Products</h3>
                            <div className="space-y-3">
                                {products.slice(0, 5).map((product) => (
                                    <div key={product._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                                        <img
                                            src={product.image || "https://via.placeholder.com/60"}
                                            alt={product.name}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{product.name}</p>
                                            <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                                        </div>
                                        <p className="font-bold text-slate-900">₹{product.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === "products" && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Products Management</h2>
                                <p className="text-slate-600 text-sm mt-1">{products.length} products in inventory</p>
                            </div>
                            <button
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg font-semibold"
                            >
                                <Plus size={20} /> Add New Product
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Add Product Form */}
                        {showAddProduct && (
                            <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Product</h3>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Product Name *
                                            </label>
                                            <input
                                                required
                                                placeholder="e.g., Wireless Headphones"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Category
                                            </label>
                                            <input
                                                placeholder="e.g., Electronics"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            required
                                            placeholder="Describe your product..."
                                            rows="3"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Price (₹) *
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Product Image *
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-slate-800 transition-all font-semibold shadow-lg">
                                                <ImagePlus size={20} />
                                                Choose Image
                                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                            </label>
                                            {imagePreview && (
                                                <div className="relative">
                                                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    Add Product
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddProduct(false);
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                                        >
                                            <X size={20} />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                                    <div className="relative">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="ml-25 w-40 h-40 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
                                                <Package size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100">
                                                <Edit size={16} className="text-slate-700" />
                                            </button>
                                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>
                                        </div>
                                        {product.stock < 10 && (
                                            <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Low Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {product.category && (
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                {product.category}
                                            </span>
                                        )}
                                        <h3 className="font-bold text-lg text-slate-900 mt-1 line-clamp-1">{product.name}</h3>
                                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">₹{product.price}</p>
                                                <p className="text-xs text-slate-500 mt-1">Stock: {product.stock || 0}</p>
                                            </div>
                                            <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Orders Management</h2>
                            <p className="text-slate-600 text-sm mt-1">{orders.length} total orders</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader className="animate-spin text-slate-400" size={48} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200">
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Order ID</th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Customer</th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Date</th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Amount</th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                <td className="py-4 px-4">
                                                    <span className="font-mono text-sm text-slate-600">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                                            <User size={16} className="text-slate-600" />
                                                        </div>
                                                        <span className="font-semibold text-slate-900">
                                                            {order.user?.name || "Guest"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-slate-600">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-bold text-slate-900">₹{order.totalAmount}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button className="text-slate-600 hover:text-slate-900 transition">
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}