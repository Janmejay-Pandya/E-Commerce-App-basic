import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/prod")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
        </div>
    );
}
