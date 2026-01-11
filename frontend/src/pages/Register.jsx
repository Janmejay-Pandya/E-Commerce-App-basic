import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { UserPlus, Mail, Lock, User, Shield, ShoppingBag, CheckCircle2 } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);
    const { currentUserId } = useAuthStore();
    const clearCart = useCartStore((state) => state.clearCart);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", form);
            toast.success("Registration successful!");
            // After registration, automatically login
            const loginRes = await api.post("/auth/login", {
                email: form.email,
                password: form.password
            });
            
            const decodedToken = jwtDecode(loginRes.data.token);
            const newUserId = decodedToken.userId;
            
            // Clear cart if no user was logged in, or if a different user is logging in
            if (!currentUserId || currentUserId !== newUserId) {
                clearCart();
            }
            
            loginStore(loginRes.data.token);

            // Redirect based on role
            if (form.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
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
                        Join Our Growing Community
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        Create an account to access exclusive deals, track your orders, and enjoy a personalized shopping experience.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="font-semibold mb-1">Exclusive Member Deals</h3>
                                <p className="text-slate-400 text-sm">Get access to special discounts and early sales</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="font-semibold mb-1">Easy Order Tracking</h3>
                                <p className="text-slate-400 text-sm">Monitor your purchases from checkout to delivery</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h3 className="font-semibold mb-1">Secure Shopping</h3>
                                <p className="text-slate-400 text-sm">Your data is protected with industry-leading security</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-slate-400 text-sm">
                    © 2024 ShopHub. All rights reserved.
                </div>
            </div>

            {/* Right Side - Registration Form */}
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
                                Create Account
                            </h2>
                            <p className="text-slate-600">
                                Start your shopping journey today
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                                        onChange={handleChange}
                                        value={form.name}
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
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

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Account Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={form.role === "user"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 border-2 rounded-lg text-center transition-all ${form.role === "user"
                                            ? "border-slate-900 bg-slate-50 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}>
                                            <User className="mx-auto mb-2 text-slate-700" size={24} />
                                            <span className="text-sm font-semibold text-slate-900 block">Customer</span>
                                            <span className="text-xs text-slate-500">Shop & browse</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={form.role === "admin"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 border-2 rounded-lg text-center transition-all ${form.role === "admin"
                                            ? "border-slate-900 bg-slate-50 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}>
                                            <Shield className="mx-auto mb-2 text-slate-700" size={24} />
                                            <span className="text-sm font-semibold text-slate-900 block">Admin</span>
                                            <span className="text-xs text-slate-500">Manage store</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                            >
                                <UserPlus size={20} />
                                Create Account
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/" className="text-slate-900 font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="underline hover:text-slate-700">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}