import { Link } from "react-router-dom";
import { MaintenanceTypeEnum, type MaintenanceEntity } from "../../../../generated-ts/models";

type Props = {maintenance : MaintenanceEntity}

function colorType(type: MaintenanceTypeEnum) {
    if (type === MaintenanceTypeEnum.Damage) {
        return <div className="bg-red-700 rounded-xl shadow-md backdrop-blue-lg py-1 px-3">{type}</div>
    } else if (type === MaintenanceTypeEnum.Info) {
        return <div className="bg-blue-700 rounded-xl shadow-md backdrop-blue-lg py-1 px-3">{type}</div>
    } else {
        return <div className="bg-amber-300 rounded-xl shadow-md backdrop-blue-lg py-1 px-3">{type}</div>
    }
}

function MaintenanceSmallRender(props: Props) {
    return (
        <Link to={"/worker/maintenances/" + props.maintenance.id} className="w-full h-full bg-gray-200/40 hover:bg-gray-700/10 w-full xl:h-40 p-4 rounded-xl shadow-xl backdrop-blur-lg transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col gap-1">
            <div className="absolute top-[0%] left-[50%] translate-[-50%] text-white font-semibold">
                {colorType(props.maintenance.type)}
            </div>
            <div className="w-full h-full flex">
                <div className="w-[60%] h-fit max-h-full flex flex-col justify-between">
                    <div className="h-full text-xl flex items-center font-semibold">
                        {props.maintenance.itemName} #{props.maintenance.itemId}
                    </div>
                    <div className="w-full h-fit font-semibold flex items-center">
                        {props.maintenance.date.toLocaleDateString()}
                    </div>
                    <div className="w-full h-full truncate">
                        {props.maintenance.note}
                    </div>
                </div>
                <div className="w-[40%] h-full flex items-center">
                    <img src={props.maintenance.itemImage} alt="image of item"></img>
                </div>
            </div>

            
        </Link>
    )
}

export default MaintenanceSmallRender;