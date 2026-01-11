import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { LogIn, Mail, Lock, ShoppingBag, Truck, CreditCard, HeadphonesIcon } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);
    const { currentUserId } = useAuthStore();
    const clearCart = useCartStore((state) => state.clearCart);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            const decodedToken = jwtDecode(res.data.token);
            const newUserId = decodedToken.userId;
            
            // Clear cart if no user was logged in, or if a different user is logging in
            if (!currentUserId || currentUserId !== newUserId) {
                clearCart();
            }
            
            loginStore(res.data.token);
            toast.success("Login successful!");
            // Redirect based on role
            const userRole = res.data.role;
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid email or password";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 text-white">
                        <ShoppingBag size={32} strokeWidth={2} />
                        <span className="text-2xl font-bold">ShopHub</span>
                    </div>
                </div>

                <div className="text-white">
                    <h1 className="text-4xl font-bold mb-6">
                        Welcome Back to ShopHub
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        Sign in to continue your shopping experience and access your account.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <Truck className="text-emerald-400 mb-3" size={28} />
                            <h3 className="font-semibold mb-1 text-sm">Fast Delivery</h3>
                            <p className="text-slate-400 text-xs">Free shipping on orders over $50</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <CreditCard className="text-emerald-400 mb-3" size={28} />
                            <h3 className="font-semibold mb-1 text-sm">Secure Payment</h3>
                            <p className="text-slate-400 text-xs">Multiple payment options available</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <HeadphonesIcon className="text-emerald-400 mb-3" size={28} />
                            <h3 className="font-semibold mb-1 text-sm">24/7 Support</h3>
                            <p className="text-slate-400 text-xs">We're here to help anytime</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <ShoppingBag className="text-emerald-400 mb-3" size={28} />
                            <h3 className="font-semibold mb-1 text-sm">Easy Returns</h3>
                            <p className="text-slate-400 text-xs">30-day return policy</p>
                        </div>
                    </div>
                </div>

                <div className="text-slate-400 text-sm">
                    © 2024 ShopHub. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 text-slate-900 mb-8 justify-center">
                        <ShoppingBag size={28} strokeWidth={2} />
                        <span className="text-xl font-bold">ShopHub</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                Sign In
                            </h2>
                            <p className="text-slate-600">
                                Welcome back! Please enter your details
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                                        onChange={handleChange}
                                        value={form.email}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                                        onChange={handleChange}
                                        value={form.password}
                                    />
                                </div>
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                            >
                                <LogIn size={20} />
                                Sign In
                            </button>
                        </form>
                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600 text-sm">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-slate-900 font-semibold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Privacy Notice */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        Protected by industry-standard encryption.{" "}
                        <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}