import { Link } from "react-router-dom"
import { MaintenanceTypeEnum, type MaintenanceEntity } from "../../../../generated-ts/models"

type Props = {maintenance: MaintenanceEntity}

function colorType(type: MaintenanceTypeEnum) {
    if (type === MaintenanceTypeEnum.Damage) {
        return <div className="bg-red-700 rounded-xl shadow-md backdrop-blue-lg py-2 px-2">{type}</div>
    } else if (type === MaintenanceTypeEnum.Info) {
        return <div className="bg-blue-700 rounded-xl shadow-md backdrop-blue-lg py-2 px-2">{type}</div>
    } else {
        return <div className="bg-amber-300 rounded-xl shadow-md backdrop-blue-lg py-2 px-2">{type}</div>
    }
}

function MaintenanceFullRender(props: Props) {
    return(
        <>
            <div className="w-full xl:h-20 flex items-center justify-center xl:flex-row p-4 text-3xl font-semibold bg-slate-50/20 backdrop-blur-lg shadow-xl rounded-xl">
                Maintenance #{props.maintenance.id}
            </div>
            <div className="w-full h-fit flex flex-col p-4 bg-slate-50/20 shadow-xl backdrop-blur-lg rounded-xl gap-2">
                <div className="w-full h-fit flex gap-2">
                    <div className="h-57 w-[65%] flex items-center">
                        <Link to={"/worker/items/" + props.maintenance.itemId} className="w-full aspect-square flex flex-col text-center text-white font-semibold gap-4">
                            <img className="h-fit shadow-xl p-4 rounded-xl backdrop-blur-lg bg-slate-50/20" src="/Placeholder.png"></img>
                        </Link>
                    </div>
                    <div className="w-full h-57 flex flex-col gap-3">
                        <div className="text-white font-semibold">
                            {colorType(props.maintenance.type)}
                        </div>
                        <div className="w-full h-fit shadow-md p-2 rounded-xl backdrop-blur-lg bg-slate-50/20 text-xl font-semibold">
                            {props.maintenance.itemName}
                        </div>
                        <div className="w-full h-fit shadow-md p-2 rounded-xl backdrop-blur-lg bg-slate-50/20 text-xl font-semibold">
                            {props.maintenance.date.toLocaleString()}
                        </div>
                        <div className="w-full h-full shadow-md p-2 rounded-xl backdrop-blur-lg bg-slate-50/20 text-xl font-semibold flex gap-2">
                            <div className="bg-linear-to-bl from-rose-500 to-red-700 w-[50%] h-fit p-2 rounded-xl shadow-xl backdrop-blur-lg text-center transition-transform transform hover:-translate-y-1 cursor-pointer">
                                Delete
                            </div>
                            <div className="bg-linear-to-bl from-amber-200 to-yellow-300 w-[50%] h-fit p-2 rounded-xl shadow-xl backdrop-blur-lg text-center transition-transform transform hover:-translate-y-1 cursor-pointer">
                                Modify
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="w-30 p+-2 text-xl font-semibold pb-2 pl-1">
                        Note
                    </div>
                    <div className="w-full h-fit min-h-40 p-4 bg-slate-50/20 rounded-xl shadow-md backdrop-blur-lg">
                        {props.maintenance.note}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MaintenanceFullRender