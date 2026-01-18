import { useEffect, useState } from "react"
import { ResponseErrorModelFromJSON, type ResponseErrorModel, type ResponseGetSingleItem } from "../../../../generated-ts/models";
import { useParams } from "react-router-dom";
import AddMaintenanceRender from "../../addons/Renders/AddMaintenanceRender";
import FakeLoadingAddMaintenance from "../../../addons/Fake/FakeLoadingAddMaintenance";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import { ItemsApi, type V1ApiItemsIdGetRequest } from "../../../../generated-ts/apis/ItemsApi";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import { Configuration } from "../../../../generated-ts/runtime";

function WorkerAddMaintenance() {
    const { id } = useParams();
    const [item, setItem] = useState<ResponseGetSingleItem | null>(null)
    const [error, setError] = useState<ResponseErrorModel | null>(null)

    useEffect(() => {
        async function getItem() {
            
            const numId = id ? Number(id) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Id not a possitive number", "id must be a number and be positive")]
                }
                setError(error)
            } else {
                const request: V1ApiItemsIdGetRequest = {
                    id: numId
                }
                const api = new ItemsApi(new Configuration({
                    credentials: "include"
                }))

                try {
                    setItem(await api.v1ApiItemsIdGet(request))
                } catch (err: any) {
                    let errorModel = null
                    if(err.response && typeof err.response?.json === "function") {
                        errorModel = ResponseErrorModelFromJSON(await err.response.json())
                    } else {
                        errorModel = {
                            timestamp: new Date(),
                            errors: [DefaultErrorMessage(err.category, err.response)]
                        }
                    }
                    setError(errorModel)
                }
            }
        }
        getItem()
    }, [id])

    return(
        <>
            {error !== null ? (<ErrorMessage error={error} setError={setError}/>) : (<></>)}
            { item === null ? (
                <FakeLoadingAddMaintenance />
            ) : (
                <AddMaintenanceRender item={item.item} setError={setError} />
            )}
        </>
    )
}

export default WorkerAddMaintenance