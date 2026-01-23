import { MaintenanceTypeEnum, type ItemEntity, type ResponseErrorModel } from "../../../../generated-ts/models"
import { MaintenancesApi, type V1ApiItemsIdMaintenancesPostRequest } from "../../../../generated-ts/apis/MaintenancesApi";
import ErrorHandle from "../../../addons/Error/ErrorHandle";
import { useNavigate } from "react-router-dom";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";


type Props = {item: ItemEntity, setError: React.Dispatch<React.SetStateAction<ResponseErrorModel | null>>}

function AddMaintenanceRender(props: Props) {

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        const selectedType = formData.get("type") as MaintenanceTypeEnum
        if (selectedType === null || selectedType.length === 0) {
            const ErrorModel: ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Wrong maintenance type exception", "You have to selected one valid maintenance type")]
            }
            props.setError(ErrorModel)
            return
        }
        const selectedText = formData.get("text") as string
        if (selectedText === null || selectedText.length === 0) {
            const ErrorModel: ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Empty maintenance note", "You have to write maintenace note")]
            }
            props.setError(ErrorModel)
            return
        }
        
        const api = new MaintenancesApi()
        const request: V1ApiItemsIdMaintenancesPostRequest = {
            id: props.item.id,
            requestAddMaintenance: {
                note: selectedText,
                type: selectedType
            }
        }
        try {
            const response = await api.v1ApiItemsIdMaintenancesPost(request)
            navigate("/worker/maintenances/" + response.maintenance.id);
        } catch (error: any) {
            await ErrorHandle(error, props.setError)
        }
    }

    return (
        <div className="w-full h-full flex items-center">
            <div className="w-1/2 h-3/4 bg-white/7 mx-auto rounded-xl backdrop-blur-xl shadow-xl flex flex-col gap-4 p-4">
                <div className="w-full h-3/7 flex flex gap-4">
                    <div className="w-2/3 h-full flex flex-col gap-2 justify-center">
                        <div className="p-2 bg-slate-50/20 w-full text-center rounded-xl shadow-sm backdrop-blur-sm">
                            {props.item.name}
                        </div>
                        <div className="flex gap-2">
                            <div className="p-2 bg-slate-50/20 w-1/2 text-center rounded-xl shadow-sm backdrop-blur-sm">
                                {props.item.category}
                            </div>
                            <div className="p-2 bg-slate-50/20 w-1/2 text-center rounded-xl shadow-sm backdrop-blur-sm">
                                {props.item.price?.priceAmount} {props.item.price?.priceCurrency}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-50/20 w-full text-center rounded-xl shadow-sm backdrop-blur-sm">
                            Last Maintenance: {props.item.lastMaintenance.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                            <div className="p-2 bg-slate-50/20 w-1/2 text-center rounded-xl shadow-sm backdrop-blur-sm">
                                {props.item.place}
                            </div>
                            <div className="p-2 bg-slate-50/20 w-1/2 text-center rounded-xl shadow-sm backdrop-blur-sm">
                                {props.item.size}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 h-full flex items-center justify-center">
                        <img className="aspect-square h-full w-fit" src={props.item.image} />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full h-4/7 flex flex-col gap-4">
                    <textarea name="text" className="w-full h-4/5 bg-slate-50/20 border-none rounded-xl p-2" placeholder="text goes here...">

                    </textarea>
                    <div className="w-full h-1/5 flex items-center justify-center gap-4">
                        <select name="type" className="bg-gray-700 p-3 text-white rounded-xl backdrop-blur-xl shadow-xl text-center">
                            {Object.values(MaintenanceTypeEnum).map((typeValue) => (
                                <option key={typeValue} value={typeValue}>
                                    {typeValue}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="p-3 px-10 bg-linear-to-bl from-sky-500 to-indigo-500 rounded-xl backdrop-blur-xl shadow-xl cursor-pointer transition-transform transform hover:-translate-y-1">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMaintenanceRender