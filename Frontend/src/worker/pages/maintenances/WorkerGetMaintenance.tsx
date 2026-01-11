import { useParams } from "react-router-dom";
import { ResponseErrorFromJSON, type MaintenanceEntity, type ResponseGetSingleMaintenance } from "../../../../generated-ts/models"
import { useEffect, useState } from "react";
import { MaintenancesApi, type V1ApiMaintenancesIdGetRequest } from "../../../../generated-ts/apis/MaintenancesApi";
import { ResponseError } from "../../../../generated-ts/runtime";
import MaintenanceFullRender from "../../addons/Renders/MaintenanceFullRender";

function WorkerGetMaintenance() {

    const { id } = useParams();
    const [maintenances, setMaintenances] = useState<ResponseGetSingleMaintenance | null>(null)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function getMaintenancesForId(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                setError("id must be a number and be positive");
            } else {
                const api = new MaintenancesApi()
                const request: V1ApiMaintenancesIdGetRequest = {
                    id: numId,
                }
                
                try {
                    const response = await api.v1ApiMaintenancesIdGet(request)
                    setMaintenances(response)
                } catch (err: any) {
                    if (err instanceof ResponseError) {
                        const json = ResponseErrorFromJSON(await err.response.json())
                        console.log(json)
                        setError(json.errors[0].toString())
                    } else {
                        setError(err?.message)
                    }
                }
            }
        }

        getMaintenancesForId(id)

    }, [id])

    return(
        <div className="w-full xl:w-[50%] 2xl:w-[35%] h-fit bg-gray-200/20 rounded-xl mx-auto p-2 xl:p-6 shadow-xl backdrop-blur-sm flex flex-col gap-4">
            {maintenances && <MaintenanceFullRender maintenance={maintenances?.maintenance} />}
        </div>
    )
}

export default WorkerGetMaintenance