import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsApi } from '../../../../generated-ts/apis/ItemsApi';
import { type RequestAddItem } from '../../../../generated-ts/models/RequestAddItem';

function WorkerAddItem() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [priceAmount, setPriceAmount] = useState(0);
    const [priceCurrency, setPriceCurrency] = useState("PLN");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null); 
        setLoading(true);

        const api = new ItemsApi();
        const body: RequestAddItem = {
            name,
            category,
            price: {
                priceAmount: Number(priceAmount),
                priceCurrency,
            },
        };

        try {
            const response = await api.v1ApiItemsPost({ requestAddItem: body });
            navigate("/v1/api/items/" + response.id);
        } catch (err: any) {
            setError(err?.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex justify-center">
            <form onSubmit={handleSubmit} className="bg-white/7 w-[50%] rounded-xl p-6 shadow-xl backdrop-blur-lg">
                <h1 className="text-white text-3xl text-center mb-4" onClick={() => navigate(-1)}>New Item</h1>

                <label className="block text-white mb-2">Name</label>
                <input className="w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder={name} onChange={e => setName(e.target.value)} />

                <label className="block text-white mb-2">Category</label>
                <input className="w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder={category} onChange={e => setCategory(e.target.value)} />

                <label className="block text-white mb-2">Price Amount</label>
                <input type="number" className="w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder={priceAmount.toString()} onChange={e => setPriceAmount(Number(e.target.value))} />

                <label className="block text-white mb-2">Currency</label>
                <input className="w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder={priceCurrency} onChange={e => setPriceCurrency(e.target.value)} />

                {error && <div className="text-red-400 mb-2">{error}</div>}

                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 rounded text-white">
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default WorkerAddItem;