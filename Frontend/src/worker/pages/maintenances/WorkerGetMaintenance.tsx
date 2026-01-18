import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MaintenancesApi, type V1ApiMaintenancesIdGetRequest } from "../../../../generated-ts/apis/MaintenancesApi";
import MaintenanceFullRender from "../../addons/Renders/MaintenanceFullRender";
import { ResponseErrorModelFromJSON, type ResponseErrorModel, type ResponseGetSingleMaintenance } from "../../../../generated-ts/models";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import { Configuration } from "../../../../generated-ts/runtime";
import ErrorHandle from "../../../addons/Error/ErrorHandle";

function WorkerGetMaintenance() {

    const { id } = useParams();
    const [maintenances, setMaintenances] = useState<ResponseGetSingleMaintenance | null>(null)
    const [error, setError] = useState<ResponseErrorModel | null>(null);

    useEffect(() => {

        async function getMaintenancesForId(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Id not a possitive number", "id must be a number and be positive")]
                }
                setError(error);
            } else {
                const api = new MaintenancesApi(new Configuration({
                    credentials: "include"
                }))
                const request: V1ApiMaintenancesIdGetRequest = {
                    id: numId,
                }
                
                try {
                    const response = await api.v1ApiMaintenancesIdGet(request)
                    setMaintenances(response)
                } catch (err: any) {
                    await ErrorHandle(err, setError)
                }
            }
        }

        getMaintenancesForId(id)

    }, [id])

    return(
        <div className="w-full xl:w-[50%] 2xl:w-[35%] h-fit bg-gray-200/20 rounded-xl mx-auto p-2 xl:p-6 shadow-xl backdrop-blur-sm flex flex-col gap-4">
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            {maintenances && <MaintenanceFullRender maintenance={maintenances?.maintenance} />}
        </div>
    )
}

export default WorkerGetMaintenance