import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { UserPlus, User, Shield } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);

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
            // After registration, automatically login
            const loginRes = await api.post("/auth/login", {
                email: form.email,
                password: form.password
            });
            loginStore(loginRes.data.token);

            // Redirect based on role
            if (form.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <UserPlus /> Register
                </h2>

                {error && <p className="text-red-500 mb-3">{error}</p>}

                <input
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full mb-3 p-2 border rounded"
                    onChange={handleChange}
                />

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

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Register as:
                    </label>
                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={form.role === "user"}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-lg text-center transition ${form.role === "user"
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}>
                                <User className="mx-auto mb-1" size={24} />
                                <span className="text-sm font-medium">User</span>
                            </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={form.role === "admin"}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-lg text-center transition ${form.role === "admin"
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}>
                                <Shield className="mx-auto mb-1 text-red-500" size={24} />
                                <span className="text-sm font-medium">Admin</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    Register
                </button>

                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/" className="text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
