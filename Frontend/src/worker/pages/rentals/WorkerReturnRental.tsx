import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type MaintenanceReturnEntity, type FullRentalEntity, type ResponseErrorModel, type ResponseGetSingleRental, MaintenanceTypeEnum } from "../../../../generated-ts/models";
import { useContext, useEffect, useState } from "react";
import { RentalsApi, type V1ApiRentalsIdReturnPostRequest } from "../../../../generated-ts/apis/RentalsApi";
import ItemOnCloseRender from "../../addons/Renders/ItemOnCloseRender";
import MaintenanceOnCloseRender from "../../addons/Renders/MaintenanceOnCloseRender";
import { IconDeviceFloppy } from "@tabler/icons-react";
import ErrorHandle from "../../../addons/Error/ErrorHandle";
import { AuthContext } from "../../../auth/AuthContext";
import { Configuration } from "../../../../generated-ts/runtime";

function WorkerReturnRental() {

    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const {state} = useLocation()
    const [rental, setRental] = useState<FullRentalEntity>(state as FullRentalEntity)
    const [maintenances, setMaintenances] = useState<MaintenanceReturnEntity[]>([])
    const [id, setId] = useState<number>(0)
    const [type, setType] = useState<MaintenanceTypeEnum>(MaintenanceTypeEnum.Info)
    const [note, setNote] = useState<string>("")
    const navigate = useNavigate()

    useEffect(() => {
        if (rental === null) {
            navigate("/")
    }
    }, [])

    function handleMaintenanceAdd() {
        if (id === 0 || note.trim() === "") {
            return
        }
        if (!rental.items.map(k => k.item.id).includes(id)) {
            return
        }
        const newMaintenance: MaintenanceReturnEntity = {
            id: id,
            note: note,
            type: type
        }
        setMaintenances([
            ...maintenances,
            newMaintenance
        ])
    }

    async function returnRental() {
        const api = new RentalsApi(new Configuration({
            credentials: "include"
        }))
        const request: V1ApiRentalsIdReturnPostRequest = {
            requestReturnRental: {
                maintenances: maintenances
            },
            id: rental.rental.id
        }

        try {
            const response = await api.v1ApiRentalsIdReturnPost(request)
            navigate(-1)
        } catch (error: any) {
            await ErrorHandle(error, setError)
        }        
    }

    return(
        <div className="w-9/10 h-full bg-linear-to-tl from-white/7 to-white/10 shadow-xl rounded-xl backdrop-blur-sm p-4 mx-auto flex-col">
            <div className="w-full h-full flex flex-col gap-4">
                <div className="w-full flex justify-center">
                    <span className="text-3xl font-bold bg-gray-700 p-4 text-white rounded-xl shadow-xl backdrop-blur-xl">{"Returning rental: #" + rental.rental.id}</span>
                </div>
                <div className="w-full h-full flex gap-4">
                    <div className="w-full md:w-1/2 h-full p-4 flex flex-col items-center gap-4">
                        <span className="text-2xl font-bold bg-gray-700 p-4 rounded-xl shadow-xl backdrop-blur-xl text-white">Items in rental</span>
                        <div className="w-full bg-gray-700 rounded-xl p-4 shadow-xl backdrop-blur-xl gap-2 min-h-120">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full h-full gap-3">
                                {rental.items.length > 0 ? (
                                    rental.items.map((item) => (
                                        <ItemOnCloseRender item={item} />
                                    ))
                                ) : (
                                    <div>not found</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-full p-4 flex flex-col items-center gap-4">
                        <span className="text-2xl font-bold bg-gray-700 p-4 rounded-xl shadow-xl backdrop-blur-xl text-white">Added maintenances</span>
                        <div className="w-full bg-gray-700 rounded-xl p-4 shadow-xl backdrop-blur-xl gap-2 min-h-120 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-2">
                                <div className="bg-linear-to-tl from-white/70 to-white/60 w-full h-40 rounded-xl shadow-xl backdrop-blur-xl p-2 gap-2 flex flex-col relative">
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="id" onChange={(e) => setId(Number(e.target.value))} className="w-1/2 bg-gray-700 text-white rounded-lg p-2 border border-gray-600"></input>
                                        <select onChange={(e) => setType(e.target.value as MaintenanceTypeEnum)} required className="w-1/2 bg-gray-700 text-white rounded-lg p-2 border border-gray-600">
                                            {Object.values(MaintenanceTypeEnum).map((typeValue) => (
                                                <option key={typeValue} value={typeValue}>
                                                    {typeValue}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex w-full h-full overflow-y-auto overflow-hidden">
                                        <textarea name="text" required onChange={(e) => {
                                            setNote(e.target.value)
                                        }} className="w-full h-full bg-gray-700 border-none rounded-xl p-2 text-white" placeholder="text goes here...">

                                        </textarea>
                                    </div>
                                    <button onClick={handleMaintenanceAdd} className="absolute bottom-0 right-0 cursor-pointer bg-sky-400 rounded-lg translate-x-[25%] translate-y-[25%]">
                                        <IconDeviceFloppy size={32}/>
                                    </button>
                                </div>
                                {maintenances.length > 0 ? (
                                    maintenances.map((maintenance) => (
                                        <MaintenanceOnCloseRender maintenance={maintenance}/>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <div onClick={returnRental} className="w-fit bg-linear-to-tl from-sky-500 to-indigo-700 p-4 rounded-xl shadow-xl text-white font-bold text-xl backdrop-blur-xl cursor-pointer">
                        Return Rental
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkerReturnRental