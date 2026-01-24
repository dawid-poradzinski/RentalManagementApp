import { Link, useLocation, useNavigate } from "react-router-dom"
import { AvailabilityApi, type V1ApiShopItemShopPostRequest } from "../../../../generated-ts/apis/AvailabilityApi"
import { Configuration } from "../../../../generated-ts/runtime"
import type { ResponseErrorModel, BuyerEntity, RentalDate } from "../../../../generated-ts/models"
import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../ShopContext"
import ItemSummaryRender from "../../addons/renders/ItemSummaryRender"
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import ErrorHandle from "../../../addons/Error/ErrorHandle"
import ErrorMessage from "../../../addons/Error/ErrorMessage"

function ItemShopSummary() {

    const {state} = useLocation()
    const buyerEntity = state as BuyerEntity
    const {shopInfo, koszyk, clearKoszyk} = useContext(ShopContext)
    const [error, setError] = useState<ResponseErrorModel | null>(null)
    const [value, setValue] = useState<number>(koszyk.reduce((acc, item) => acc + item.price.priceAmount, 0))
    const [currency] = useState<string>(koszyk[0].price.priceCurrency)
    const navigator = useNavigate()

    if(buyerEntity === undefined || shopInfo === undefined || shopInfo?.token === undefined) {
        navigator("/refresh")
    }

    useEffect(() => (
        setValue(koszyk.reduce((acc, item) => acc + item.price.priceAmount, 0))
    ), [koszyk])

    async function startRental(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        const percent = formData.get("pay") as string
        let toPay = 30
        if (typeof percent === "string" && percent.trim() !== "") {
            const numPerc = Number(percent)
            if (!Number.isNaN(numPerc) && numPerc > 29 && numPerc < 101) {
                toPay = numPerc
            }
        }

        const api = new AvailabilityApi(new Configuration({
            credentials: "include"
        }))
        const request: V1ApiShopItemShopPostRequest = {
            requestItemShop: {
                buyer: buyerEntity as BuyerEntity,
                token: shopInfo?.token as string,
                rental: shopInfo?.date as RentalDate,
                items: koszyk.map(item => item.id),
                paid: {
                    priceAmount: value*(toPay/100),
                    priceCurrency: currency,
                }
            }
        }
        try {
            const response = await api.v1ApiShopItemShopPost(request)
            clearKoszyk()
            navigator("/")
        } catch (error: any) {
            ErrorHandle(error, setError)
        }
    }

    return(
        <form onSubmit={startRental} className="w-9/10 h-full mx-auto rounded-xl shadow-xl backdrop-blur-sm bg-linear-to-tl from-white/7 to-white/10 flex flex-col gap-4 p-4">
            {error !== null ? (<ErrorMessage error={error} setError={setError}/>) : (<></>)}
            <div className="w-full h-9/10 flex gap-4 flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-gray-700 p-4 rounded-xl shadow-xl backdrop-blur-sm h-full max-h-190 overflow-y-auto">
                    <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid h-fit">
                        {koszyk && koszyk.length > 0 ? (
                            koszyk.map((item) => (
                                <ItemSummaryRender item={item} />
                            ))
                        ) : (
                            <div>not found</div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-linear-to-tl from-white/40 to-white/60 rounded-xl shadow-xl backdrop-blur-xl flex flex-col items-center p-4 gap-4">
                        <div className="w-full h-fit flex flex-col gap-4">
                            <span className="mt-4 w-full text-center text-3xl font-bold">
                                Rental Date:
                            </span>
                            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-2xl">
                                <div className="flex flex-col">
                                    <span className="">From:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{shopInfo?.date.from.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="">To:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{shopInfo?.date.to.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4">
                            <span className="mt-4 w-full text-center text-3xl font-bold">
                                To pay:
                            </span>
                            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-2xl">
                                <div className="flex flex-col">
                                    <span className="">Value:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{value.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="">Currency:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{currency}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4">
                            <span className="mt-4 w-full text-center text-3xl font-bold">
                                Rental Summary
                            </span>
                            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-2xl">
                                <div className="flex flex-col">
                                    <span className="">Name:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{buyerEntity.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="">Surname:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{buyerEntity.surname}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="">Phone:</span>
                                    <span className="bg-gray-700 square p-4 rounded-md shadow-md backdrop-blur-xl text-white">{buyerEntity.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="">
                                        Pay now:
                                    </span>
                                    <div className="w-full h-fit gap-4 font-bold text-2xl">
                                        <select
                                            className="bg-gray-700 w-full square p-4 rounded-md shadow-md backdrop-blur-xl text-white"
                                            name="pay">
                                                <option key='full' value={"100"}>
                                                    {"100% " + value + " " + currency}
                                                </option>
                                                <option key='notFull' value={"30"}>
                                                    {"30% " + (value*0.3).toFixed(2) + " " + currency}
                                                </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div className="w-fit mx-auto md:w-full flex items-center h-1/10 justify-around flex-col md:flex-row">
                <Link to={"/shop/buyer"} className="flex gap-2 w-fit text-center bg-linear-to-bl from-amber-200 to-yellow-300 py-2 px-6 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">
                    <IconArrowLeft />
                    Change personal info
                </Link>
                <button className="justify-center flex gap-2 w-full md:w-fit text-center bg-linear-to-bl from-sky-600 to-indigo-700 text-white py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">
                    <IconDeviceFloppy />
                    Rent
                </button>
            </div>
        </form>
    )
}

export default ItemShopSummary