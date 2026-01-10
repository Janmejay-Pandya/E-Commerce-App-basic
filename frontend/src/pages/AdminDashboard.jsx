import { useEffect, useState } from "react";
import { Plus, Package, ShoppingBag, X, Check, ImagePlus, Loader } from "lucide-react";
import api from "../services/api";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("products");
    const [showAddProduct, setShowAddProduct] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: ""
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

    // ✅ IMAGE HANDLER (FUNCTIONAL ONLY)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    // ✅ FIXED ADD PRODUCT LOGIC
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Please upload an image");
            return;
        }

        try {
            setUploading(true);

            // 1️⃣ Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary(imageFile);

            // 2️⃣ Send product data to backend
            await api.post("/prod", {
                ...formData,
                image: imageUrl,
                price: Number(formData.price),
                stock: Number(formData.stock) || 0
            });

            alert("Product added successfully");

            // Reset
            setFormData({ name: "", description: "", price: "", stock: "" });
            setImageFile(null);
            setShowAddProduct(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to add product");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

                {/* TABS */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 font-semibold transition ${activeTab === "products"
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Package size={20} className="inline mr-2" />
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-3 font-semibold transition ${activeTab === "orders"
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <ShoppingBag size={20} className="inline mr-2" />
                        Orders
                    </button>
                </div>

                {/* PRODUCTS */}
                {activeTab === "products" && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Products</h2>
                            <button
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                <Plus size={20} /> Add Product
                            </button>
                        </div>

                        {showAddProduct && (
                            <form onSubmit={handleAddProduct} className="mb-6 p-6 bg-gray-50 rounded-lg">
                                {/* 🔴 UI KEPT SAME – ONLY INPUT HANDLER CHANGED */}
                                <input required placeholder="Product Name" className="w-full mb-3 p-2 border rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <textarea required placeholder="Description" className="w-full mb-3 p-2 border rounded"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <input required type="number" placeholder="Price" className="w-full mb-3 p-2 border rounded"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <input type="number" placeholder="Stock" className="w-full mb-3 p-2 border rounded"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />

                                {/* IMAGE UPLOAD BUTTON */}
                                <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer w-fit">
                                    <ImagePlus size={18} />
                                    Upload Image
                                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                </label>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        disabled={uploading}
                                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded"
                                    >
                                        {uploading && <Loader className="animate-spin" size={18} />}
                                        <Check size={18} /> Add Product
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowAddProduct(false)}
                                        className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded"
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* PRODUCT GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <div key={product._id} className="border rounded-lg p-4">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-40 object-cover rounded mb-3"
                                        />
                                    ) : (
                                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded mb-3 text-gray-400 text-sm">
                                            No Image Available
                                        </div>
                                    )}

                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-600">{product.description}</p>
                                    <p className="font-bold text-indigo-600">₹{product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">All Orders</h2>
                        {loading ? "Loading..." : orders.map(o => (
                            <div key={o._id} className="border-b py-2">
                                {o.user?.name} — ₹{o.totalAmount}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
