import { IconPhone, IconPhoneFilled, IconUserFilled } from "@tabler/icons-react"
import { RentalStatusTypeEnum, type FullRentalEntity } from "../../../../generated-ts/models"
import ItemInRentalRender from "./ItemInRentalRender"

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

function getRentalTimeStatus(endDate: Date, status: RentalStatusTypeEnum) {
    const now = status == RentalStatusTypeEnum.Reserved ? Date.now() : endDate.valueOf()
    const end = endDate.valueOf();
    const diff = end - now;
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / (1000 * 60 * 60));
    const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const formatted = `${hh}h:${mm}m`
    const isLate = diff < 0;
    return (
        <div className={isLate ? "text-red-500" : "text-green-500"}>
            {(isLate ? "-" : "+") + formatted}
        </div>
    )
}

function RentalFullRender(props: Props) {
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
                            Remaining: {getRentalTimeStatus(props.rental.rental.rentalDate.to, props.rental.rental.rentalStatus)}
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
        </div>
    )
}

export default RentalFullRender