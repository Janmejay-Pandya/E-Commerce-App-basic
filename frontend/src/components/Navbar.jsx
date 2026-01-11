import { ShoppingCart, LogOut, Shield, ShoppingBag, User, Menu, X, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { cart, clearCart } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartItemsCount = cart.reduce((total, item) => total + item.qty, 0);

    const handleLogout = () => {
        clearCart();
        logout();
        toast.success("Logged out successfully!");
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to={user ? "/home" : "/"}
                        className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors group"
                    >
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-lg">
                            <ShoppingBag size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold">ShopHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {user && (
                            <>
                                <Link
                                    to="/home"
                                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors font-medium group"
                                >
                                    <Home size={18} className="group-hover:scale-110 transition-transform" />
                                    Home
                                </Link>

                                <Link
                                    to="/cart"
                                    className="relative flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors font-medium group"
                                >
                                    <div className="relative">
                                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                        {cartItemsCount > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                                {cartItemsCount}
                                            </span>
                                        )}
                                    </div>
                                    Cart
                                </Link>
                            </>
                        )}

                        {(user?.role === "admin" || user?.role === "ADMIN") && (
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold shadow-md hover:shadow-lg group"
                            >
                                <Shield size={18} className="group-hover:scale-110 transition-transform" />
                                Admin Panel
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                                        <User size={18} className="text-slate-700" />
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium group"
                                >
                                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/"
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} className="text-slate-700" />
                        ) : (
                            <Menu size={24} className="text-slate-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white shadow-xl">
                    <div className="px-4 py-4 space-y-3">
                        {user && (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>

                                <Link
                                    to="/home"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                                >
                                    <Home size={20} />
                                    Home
                                </Link>

                                <Link
                                    to="/cart"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart size={20} />
                                        Cart
                                    </div>
                                    {cartItemsCount > 0 && (
                                        <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {(user?.role === "admin" || user?.role === "ADMIN") && (
                            <Link
                                to="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 bg-slate-900 text-white rounded-lg font-semibold shadow-md"
                            >
                                <Shield size={20} />
                                Admin Panel
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full text-center px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold shadow-lg"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}