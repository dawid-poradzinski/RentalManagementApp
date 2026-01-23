import { useContext, useState } from "react"
import { ShopContext } from '../ShopContext';
import ItemInKoszykRender from "../addons/renders/ItemInKoszykRender"
import { AvailabilityApi, type V1ApiShopItemCheckPostRequest } from '../../../generated-ts/apis/AvailabilityApi';
import { Configuration } from "../../../generated-ts/runtime"
import ErrorHandle from "../../addons/Error/ErrorHandle";
import type { ResponseErrorModel, ResponseItemCheck } from "../../../generated-ts/models";
import { useNavigate } from "react-router-dom";

function ItemCheck() {

    const {koszyk, shopInfo} = useContext(ShopContext)
    const [error, setError] = useState<ResponseErrorModel | null>(null)
    const navigate = useNavigate()

    async function handleFlightCheck() {

        if(shopInfo === undefined || koszyk.length === 0) {
            return
        }
        const api = new AvailabilityApi(new Configuration({
            credentials: "include"
        }))
        const request: V1ApiShopItemCheckPostRequest = {
            requestItemCheck: {
                items: koszyk.map((k) => k.id),
                rental: shopInfo!.date,
                token: shopInfo?.token
            }
        }
        try {
            const response = await api.v1ApiShopItemCheckPost(request)
            navigate("result", {state: response})
        } catch (error: any) {
            ErrorHandle(error, setError)
        }
    }

    return(
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full 2xl:w-4/6 h-full rounded-xl shadow-xl backdrop-blur-xl bg-white/7 flex gap-4 p-4 xl:flex-row flex-col">
                <div className="w-full xl:w-2/3 bg-linear-to-bl from-white/30 to-white/40 rounded-xl shadow-xl rounded-xl p-4 flex flex-col">
                    <span className="w-full text-3xl font-bold text-center mb-4 xl:my-10">
                        Items
                    </span>
                    <div className="bg-gray-700 w-full rounded-md shadow-xl p-4 backdrop-blur-xl h-150">
                        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-3 gap-2 overflow-y-auto max-h-144">
                            {koszyk && koszyk.length > 0 ? (
                                koszyk.map((item) => (
                                    <ItemInKoszykRender item={item} />
                                ))
                            ) : (
                                <div>not found</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full xl:w-1/3 rounded-xl shadow-xl backdrop-blur-xl bg-linear-to-br from-white/30 to-white/40 p-4 flex flex-col gap-2">
                    <span className="w-full h-fit text-3xl font-bold text-center mt-4 xl:my-10">
                        Summary
                    </span>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">
                            From:
                        </span>
                        <span className="w-full bg-gray-700 rounded-xl p-2 text-white text-xl">
                            {shopInfo?.date?.from ? shopInfo?.date.from.toLocaleString() : "none"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">
                            To:
                        </span>
                        <span className="w-full bg-gray-700 rounded-xl p-2 text-white text-xl">
                            {shopInfo?.date?.to ? shopInfo?.date.to.toLocaleString() : "none"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">
                            Place
                        </span>
                        <span className="w-full bg-gray-700 rounded-xl p-2 text-white text-xl">
                            {shopInfo?.place ? shopInfo.place : "none"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">
                            Estimated price:
                        </span>
                        <span className="w-full bg-gray-700 rounded-xl p-2 text-white text-xl">
                            { koszyk.length > 0 ? (koszyk.reduce((acc, item) => acc + item.price.priceAmount, 0).toFixed(2) + koszyk[0].price.priceCurrency)  : ("none") }
                        </span>
                    </div>
                    <div className="my-4 xl:my-0 w-full h-full flex items-center justify-center">
                        <button onClick={() => koszyk.length > 0 ? handleFlightCheck() : {}} className="bg-linear-to-bl from-sky-600 to-indigo-700 p-4 rounded-xl shadow-xl backdrop-blur-xl text-2xl text-white font-bold cursor-pointer transition-transform transform hover:-translate-y-1 ">
                            Check Availability
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCheck