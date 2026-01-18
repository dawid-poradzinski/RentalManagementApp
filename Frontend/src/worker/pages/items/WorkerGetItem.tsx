import { useParams } from "react-router-dom";
import { ItemsApi, type V1ApiItemsIdGetRequest } from "../../../../generated-ts/apis/ItemsApi";
import { useState, useEffect } from "react";
import ItemFullRender from "../../addons/Renders/ItemFullRender";
import { ResponseErrorModelFromJSON, type ResponseErrorModel, type ResponseGetSingleItem } from "../../../../generated-ts/models";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import { Configuration } from "../../../../generated-ts/runtime";

function WorkerGetItem() {
    const { id } = useParams();
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const [response, setResponse] = useState<ResponseGetSingleItem | null>(null);

    useEffect(() => {
        async function findItem(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Id not a possitive number", "id must be a number and be positive")]

                }
                setError(error);
            } else {
                const api = new ItemsApi(new Configuration({
                    credentials: "include"
                }));
                const request: V1ApiItemsIdGetRequest = {
                    id: numId
                };
                
                try {
                    const response = await api.v1ApiItemsIdGet(request)
                    setResponse(response)
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

        findItem(id);
    }, [id]);
    
    return (
        <>
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            {response && <div className="mb-2 w-full h-fit flex "><ItemFullRender item={response.item} /></div>}
        </>   
    );
}

export default WorkerGetItem;