import { ShoppingCart, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to={user ? "/home" : "/"} className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
                ShopX
            </Link>

            <div className="flex gap-4 items-center">
                {user && (
                    <>
                        <Link to="/home" className="text-gray-700 hover:text-indigo-600 transition font-medium">
                            Home
                        </Link>
                        <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition font-medium">
                            <ShoppingCart className="inline mr-1" size={20} /> Cart
                        </Link>
                    </>
                )}

                {(user?.role === "admin" || user?.role === "ADMIN") && (
                    <Link to="/admin" className="text-red-600 hover:text-red-700 transition font-medium">
                        <Shield className="inline mr-1" size={20} /> Admin
                    </Link>
                )}

                {user ? (
                    <button onClick={() => {
                        logout();
                        navigate("/");
                    }} className="text-gray-700 hover:text-red-600 transition font-medium">
                        <LogOut className="inline mr-1" size={20} /> Logout
                    </button>
                ) : (
                    <Link to="/" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
