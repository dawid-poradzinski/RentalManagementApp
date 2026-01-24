import { IconPhone, IconPhoneFilled, IconUserFilled } from "@tabler/icons-react"
import { RentalStatusTypeEnum, type ResponseErrorModel, type FullRentalEntity, type SmallRentalEntity } from "../../../../generated-ts/models"
import ItemInRentalRender from "./ItemInRentalRender"
import { Link, useNavigate } from "react-router-dom"
import { RentalsApi, type V1ApiRentalsIdClosePostRequest, type V1ApiRentalsIdPayPostRequest } from "../../../../generated-ts/apis/RentalsApi"
import ErrorHandle from "../../../addons/Error/ErrorHandle"
import { useState } from "react"
import { Configuration } from "../../../../generated-ts/runtime"

type Props = {rental: FullRentalEntity}

function colorType(type: RentalStatusTypeEnum) {
    if (type === RentalStatusTypeEnum.Finished) {
        return <div className="bg-red-700 rounded-xl shadow-md py-2 px-3 text-white">{type}</div>
    } else if (type === RentalStatusTypeEnum.Reserved) {
        return <div className="bg-blue-700 rounded-xl shadow-md py-2 px-3 text-white">{type}</div>
    } else {
        return <div className="bg-amber-300 rounded-xl shadow-md py-2 px-3 text-white">{type}</div>
    }
}

function getRentalTimeStatus(rental: SmallRentalEntity) {
    const now = rental.rentalStatus == RentalStatusTypeEnum.Reserved ? Date.now() : rental.rentalReturn.valueOf()
    const end = rental.rentalDate.to.valueOf();
    const diff = end - now;
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / (1000 * 60 * 60));
    const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const formatted = `${hh}h:${mm}m`
    const isLate = diff < 0;
    return (
        <div className="flex gap-2">
            {(rental.rentalStatus == RentalStatusTypeEnum.Returning ? "Returned:" : "Remaining time:")}
            <span className={isLate ? "text-red-500" : "text-green-500"}>
                { (isLate ? "-" : "+") + formatted}
            </span>
        </div>
    )
}

function RentalFullRender(props: Props) {

    const navigate = useNavigate()
    const [error, setError] = useState<ResponseErrorModel | null>(null)
    console.log(props.rental.rental.paidPrice, props.rental.rental.totalPrice)

    async function payRemaining() {
        const api = new RentalsApi(new Configuration({
            credentials: "include"
        }))
        const request: V1ApiRentalsIdPayPostRequest = {
            id: props.rental.rental.id
        }
        
        try {
            await api.v1ApiRentalsIdPayPost(request);
            navigate(0)
        } catch (error: any) {
            await ErrorHandle(error, setError);
        }
    }

    async function closeRental() {
        const api = new RentalsApi(new Configuration({
            credentials: "include"
        }))
        const request: V1ApiRentalsIdClosePostRequest = {
            id: props.rental.rental.id
        }
        
        try {
            await api.v1ApiRentalsIdClosePost(request);
            navigate(0)
        } catch (error: any) {
            await ErrorHandle(error, setError);
        }
    }

    return(
        <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full h-20 text-3xl font-bold bg-slate-200/50 rounded-xl flex items-center justify-between p-4 shadow-xl backdrop-blur-xl">
                <div>
                    Rental #{props.rental.rental.id} 
                </div>
                {colorType(props.rental.rental.rentalStatus)}
            </div>
            <div className="w-full h-full flex flex-col gap-4">
                <div className="w-full h-full flex gap-2 flex">

                    <div className="w-1/3 h-full flex flex-col gap-2 bg-slate-200/50 rounded-xl shadow-xl backdrop-blur-xl p-4">
                        <div className="text-2xl font-bold">
                            Person info
                        </div>
                        <div className="w-full flex items-center text-2xl gap-2 font-bold">
                            <IconUserFilled size={32}/>
                            {props.rental.buyer.name} {props.rental.buyer.surname}
                        </div>
                        <div className="w-full flex items-center text-2xl gap-2">
                            <IconPhoneFilled size={32} />
                            {props.rental.buyer.phone}
                        </div>
                    </div>

                    <div className="w-1/3 flex flex-col gap-2 bg-slate-200/50 rounded-xl shadow-xl backdrop-blur-xl p-4">
                        <div className="text-2xl font-bold">
                            Money info
                        </div>
                        <div className="w-full text-2xl">
                        {"Total: " + props.rental.rental.totalPrice.priceAmount + props.rental.rental.totalPrice.priceCurrency}
                        </div>
                        <div className="w-full text-2xl">
                            {"Paid: " + props.rental.rental.paidPrice.priceAmount + props.rental.rental.paidPrice.priceCurrency}
                        </div>
                    </div>

                    <div className="w-1/3 flex flex-col gap-2 bg-slate-200/50 rounded-xl shadow-xl backdrop-blur-xl p-4">
                        <div className="text-2xl font-bold">
                            Time info:
                        </div>
                        <div className="h-full w-full text-2xl">
                            Rented to: {props.rental.rental.rentalDate.to.toLocaleTimeString()}
                        </div>
                        <div className="flex text-2xl">
                            {getRentalTimeStatus(props.rental.rental)}
                        </div>
                    </div>
                </div>
                <div className="w-full h-full text-xl">
                    <div className="flex gap-2">
                        {"Rental Date: " + props.rental.rental.rentalDate.from.toLocaleString() + " - " + props.rental.rental.rentalDate.to.toLocaleString()}
                    </div>
                    <div>
                        {props.rental.rental.rentalPlace}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2 text-right bg-slate-200/50 rounded-xl shadow-xl backdrop-blur-xl p-4">
                    <div className="text-center font-bold text-3xl">
                        Items rented
                    </div>
                    <div className="w-full max-h-120 flex flex-col mx-auto grid grid-cols-3 gap-1">
                         {props.rental.items.length > 0 ? (
                                props.rental.items.map((item) => (
                                    <ItemInRentalRender item={item}/>
                                ))
                            ) : (
                                <div>not found</div>
                            )}
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                {
                    props.rental.rental.rentalStatus == RentalStatusTypeEnum.Finished ?
                    <></>
                    :
                    props.rental.rental.rentalStatus == RentalStatusTypeEnum.Reserved ?
                        <button onClick={() => navigate("return", {state: props.rental})} className="button font-bold text-white bg-linear-to-bl from-rose-500 to-red-700 p-4 w-fit rounded-xl shadow-xl backdrop-blur-xl">
                        Return rental
                        </button>
                    : 
                        props.rental.rental.totalPrice.priceAmount != props.rental.rental.paidPrice.priceAmount ?
                            <button onClick={() => payRemaining()} className="button font-bold text-white bg-linear-to-bl from-rose-500 to-red-700 p-4 w-fit rounded-xl shadow-xl backdrop-blur-xl">
                                Pay rental
                            </button>
                            :
                            <button onClick={() => closeRental()} className="button font-bold text-white bg-linear-to-bl from-rose-500 to-red-700 p-4 w-fit rounded-xl shadow-xl backdrop-blur-xl">
                                Close rental
                            </button>
                }
            </div>
        </div>
    )
}

export default RentalFullRender