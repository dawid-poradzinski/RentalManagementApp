import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsApi } from '../../../../generated-ts/apis/ItemsApi';
import { type RequestAddItem } from '../../../../generated-ts/models/RequestAddItem';
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import { PlacesEnum, SizeEnum, type ErrorModel, type ResponseErrorModel } from "../../../../generated-ts/models";
import ErrorHandle from "../../../addons/Error/ErrorHandle";

function WorkerAddItem() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null); 
        setLoading(true);
        const formData = new FormData(e.currentTarget)

        const errorList: ErrorModel[] = []

        const name = formData.get("name") as string

        if (name === null || name.length == 0) {
            errorList.push(DefaultErrorMessage("Name is empty exception", "Name cannot be empty or null"))
        }

        const category = formData.get("category") as string

        if (category === null || category.length == 0) {
            errorList.push(DefaultErrorMessage("Category is empty exception", "Category cannot be empty or null"))
        }

        const price = Number(formData.get("priceAmount") as string)

        if (Number.isNaN(price) || price <= 0) {
            errorList.push(DefaultErrorMessage("Price Exception", "Price must be a number and be positive"))
        }

        const currency = formData.get("priceCurrency") as string

        if (currency === null || currency.length !== 3) {
            errorList.push(DefaultErrorMessage("Currency is empty exception", "Currency cannot be empty and must be 3 letters"))
        }

        const image = formData.get("image") as string

        if (image === null || image.length == 0) {
            errorList.push(DefaultErrorMessage("Image is empty exception", "image cannot be empty or null"))
        }

        const place = formData.get("place") as PlacesEnum

        if (place === null || place.length == 0) {
            errorList.push(DefaultErrorMessage("Place is wrong exception", "Place must be of type PlacesEnum"))
        }

        const size = formData.get("size") as SizeEnum

        if (size === null || size.length == 0) {
            errorList.push(DefaultErrorMessage("Size is wrong exception", "Size must be of type PlacesEnum"))
        }

        if (errorList.length !== 0) {
            setError(
                {
                    timestamp: new Date(),
                    errors: errorList
                }
            )
            setLoading(false);
            return
        }

        const body: RequestAddItem = {
            name: name,
            category: category,
            price: {
                priceAmount: price,
                priceCurrency: currency
            },
            image: image,
            place: place,
            size: size
        };

        const api = new ItemsApi();

        try {
            const response = await api.v1ApiItemsPost({ requestAddItem: body });
            navigate("/worker/items/" + response.id);
        } catch (err: any) {
            await ErrorHandle(err, setError)
        }
        setLoading(false);
    }

    return (
        <div className="w-full h-full flex justify-center">
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            <form onSubmit={handleSubmit} className="bg-white/7 w-[50%] rounded-xl p-6 shadow-xl backdrop-blur-lg">
                <h1 className="text-white text-3xl text-center mb-4">New Item</h1>

                <label className="block text-white mb-2">Name</label>
                <input className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder="name" name="name"/>

                <label className="block text-white mb-2">Category</label>
                <input className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder="category" name="category"/>

                <label className="block text-white mb-2">Price Amount</label>
                <input type="number" step={".01"} className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder="29.99" name="priceAmount"/>

                <label className="block text-white mb-2">Currency</label>
                <input className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder="PLN" name="priceCurrency"/>
                
                <label className="block text-white mb-2">Image path</label>
                <input className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white" placeholder="/Placeholder.png" name="image"/>

                <label className="block text-white mb-2">Place</label>
                <select name="place" className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white">
                    {Object.values(PlacesEnum).map((typeValue) => (
                        <option key={typeValue} value={typeValue}>
                            {typeValue}
                        </option>
                    ))}
                </select>

                <label className="block text-white mb-2">Size</label>
                <select name="size" className="bg-gray-700 w-full mb-4 p-2 border-3 border-black rounded-md focus:outline-none text-white">
                    {Object.values(SizeEnum).map((typeValue) => (
                        <option key={typeValue} value={typeValue}>
                            {typeValue}
                        </option>
                    ))}
                </select>

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