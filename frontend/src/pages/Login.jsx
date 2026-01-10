import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { LogIn } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);

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
            loginStore(res.data.token);
            // Redirect based on role
            const userRole = res.data.role;
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <LogIn /> Login
                </h2>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full mb-4 p-2 border rounded"
                    onChange={handleChange}
                />

                <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    Login
                </button>

                <p className="mt-4 text-sm text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
