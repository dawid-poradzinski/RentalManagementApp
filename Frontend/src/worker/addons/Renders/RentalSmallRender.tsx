import { Link } from "react-router-dom"
import { RentalStatusTypeEnum, type RentalDate, type SmallRentalEntity } from "../../../../generated-ts/models"
import { IconCalendarTime, IconCalendarWeek, IconCurrencyDollar, IconReceipt2 } from "@tabler/icons-react"

type Props = {rental: SmallRentalEntity}

function colorType(type: RentalStatusTypeEnum) {
    if (type === RentalStatusTypeEnum.Finished) {
        return <div className="bg-red-700 rounded-xl shadow-md py-2 px-3">{type}</div>
    } else if (type === RentalStatusTypeEnum.Reserved) {
        return <div className="bg-blue-700 rounded-xl shadow-md py-2 px-3">{type}</div>
    } else {
        return <div className="bg-amber-300 rounded-xl shadow-md py-2 px-3">{type}</div>
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

function RentalSmallRender(props: Props) {
    return(
        <Link to={"/worker/rentals/" + props.rental.id} className="w-full max-h-50 h-full bg-gray-200/40 hover:bg-gray-700/10 p-4 shadow-xl rounded-xl backdrop-blur-xl flex flex-col gap-2">
            <div className="w-full h-20 text-white flex justify-center h-fit">
                {colorType(props.rental.rentalStatus)}
            </div>
            <div className="w-full h-8 flex gap-2 bg-white/7 p-1 rounded-md shadow-md backdrop-blur-xl">
                <div>
                    <IconCalendarWeek/>
                </div>
                <div>
                    {props.rental.rentalDate.from.toLocaleDateString()} - {props.rental.rentalDate.to.toLocaleDateString()}
                </div>
            </div>
            <div className="w-full h-8 flex gap-2 bg-white/7 p-1 rounded-md shadow-md backdrop-blur-xl">
                <div>
                    <IconCalendarTime/>
                </div>
                <div>
                    {props.rental.rentalDate.from.toLocaleTimeString()}H - {props.rental.rentalDate.to.toLocaleTimeString()}H
                </div>
                {getRentalTimeStatus(props.rental.rentalDate.to, props.rental.rentalStatus)}
            </div>
            <div className="w-full h-8 flex gap-2">
                <div className="w-1/2 flex bg-white/7 p-1 rounded-md shadow-md backdrop-blur-xl">
                    <IconCurrencyDollar/>
                    {props.rental.totalPrice.priceAmount + " "} 
                    {props.rental.totalPrice.priceCurrency}
                </div>
                <div className="w-1/2 flex bg-white/7 p-1 rounded-md shadow-md backdrop-blur-xl">
                    <IconReceipt2/>
                    {props.rental.paidPrice.priceAmount + " "} 
                    {props.rental.totalPrice.priceCurrency}
                </div>
            </div>
        </Link>
    )
}

export default RentalSmallRender