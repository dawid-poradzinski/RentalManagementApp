import { Link } from "react-router-dom"
import type { ItemEntity } from "../../../../generated-ts/models"

type Props = {item: ItemEntity}

export default function ItemFullRender(props: Props) {

    function determinateCondition() {
        if (props.item.damaged === true) {
            return (
                <div className="xl:w-2/5 h-fit p-2 bg-red-800 backdrop-blur-lg rounded-xl shadow-md font-semibold text-white text-center">
                    Condition: Damaged
                </div>
            )
        } else if (Math.round((props.item.lastMaintenance.getTime() - Date.now()) / (1000*60*60*24) )) {
            return (
                <div className="xl:w-2/5 h-fit p-2 bg-red-600 backdrop-blur-lg rounded-xl shadow-md font-semibold text-white text-center">
                    Condition: Need Maintenance
                </div>
            )
        } else {
            return (
                <div className="xl:w-2/5 h-fit p-2 bg-lime-500 backdrop-blur-lg rounded-xl shadow-md font-semibold text-white text-center">
                    Condition: Good
                </div>
            )
        }
    }


    return (
        <div className="w-full xl:w-[50%] 2xl:w-[35%] h-fit bg-gray-200/20 rounded-xl mx-auto p-2 xl:p-6 shadow-xl backdrop-blur-sm">
            <div className="bg-[url(/Background.png)] bg-repeat h-fit rounded-xl shadow-xl backdrop-blur-lg p-4 flex flex-col gap-4">
                <div className="w-full h-fit xl:min-h-20 flex flex-col xl:flex-row p-4 text-xl bg-slate-50/20 backdrop-blur-lg shadow-xl rounded-xl gap-2 xl:gap-0 xl:items-center">
                    <div className="xl:w-3/5 h-full font-semibold text-4xl flex justify-center items-center">
                        {props.item.name}
                    </div>
                    {determinateCondition()}
                </div>
                <div className="w-full h-full xl:h-80 flex gap-5 flex-col xl:flex-row ">
                    <div className="w-full xl:w-[50%] h-full xl:h-80 flex items-center justify-center ">
                        <img className="w-60 h-60 xl:w-50 xl:h-50 aspect-square mx-auto" src={props.item.image} alt="image"></img>
                    </div>
                    <div className="w-full xl:w-[50%] h-full flex flex-col gap-2 justify-center">
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Id: {props.item.id}
                        </div>
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Category: {props.item.category}
                        </div>
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Size: {props.item.size}
                        </div>
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Place: {props.item.place}
                        </div>
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Maintenanced: {props.item.lastMaintenance.toLocaleDateString()}
                        </div>
                        <div className="w-full h-fit p-2 bg-slate-50/20 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                            Price: {props.item.price?.priceAmount} {props.item.price?.priceCurrency}
                        </div>
                    </div>
                </div>
                <div className="w-full h-full xl:h-20 flex gap-5 flex-col xl:flex-row">
                        <Link to={"maintenances"} className="text-xl h-20  w-full xl:w-[49%] bg-slate-50/20 rounded-xl shadow-xl backdrop-blur-lg flex items-center justify-center text-slate-900 transition-transform transform hover:-translate-y-1 cursor-pointer text-center">
                            Item maintenance history
                        </Link>
                        <Link to={"rentals"} className="text-xl w-full h-20 xl:w-[49%] bg-slate-50/20 rounded-xl shadow-xl backdrop-blur-lg flex items-center justify-center text-slate-900 transition-transform transform hover:-translate-y-1 cursor-pointer text-center">
                            Item rental history
                        </Link>
                    </div>
                <div className="w-full h-full bg-slate-50/20 rounded-xl shadow-xl backdrop-blur-lg p-4">
                    <div className="w-full xl:min-h-20 flex gap-5 items-center justify-center">
                        <div className="bg-rose-600 w-1/3 p-4 rounded-xl shadow-xl backdrop-blur-lg text-center transition-transform transform hover:-translate-y-1 cursor-pointer">
                            Delete
                        </div>
                        <div className="bg-amber-200 w-1/3 p-4 rounded-xl shadow-xl backdrop-blur-lg text-center transition-transform transform hover:-translate-y-1 cursor-pointer">
                            Modify item
                        </div>
                        <Link to={"maintenances/add"} className="bg-purple-400 w-1/3 p-4 rounded-xl shadow-xl backdrop-blur-lg text-center transition-transform transform hover:-translate-y-1 cursor-pointer">
                            Add maintenance
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}