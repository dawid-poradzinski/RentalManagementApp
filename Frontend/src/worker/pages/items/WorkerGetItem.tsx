import { useParams } from "react-router-dom";
import { ItemsApi, type V1ApiItemsIdGetRequest } from "../../../../generated-ts/apis/ItemsApi";
import { useState, useEffect } from "react";
import { ResponseErrorFromJSON, ResponseErrorToJSON, type ResponseGetSingleItem } from "../../../../generated-ts/models";
import { ResponseError } from "../../../../generated-ts/runtime";
import ItemFullRender from "../../addons/Renders/ItemFullRender";

function WorkerGetItem() {
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<ResponseGetSingleItem | null>(null);

    useEffect(() => {
        async function findItem(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                setError("id must be a number and be positive");
            } else {
                const api = new ItemsApi();
                const request: V1ApiItemsIdGetRequest = {
                    id: numId
                };
                
                try {
                    const response = await api.v1ApiItemsIdGet(request)
                    setResponse(response)
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

        findItem(id);
    }, [id]);
    
    return (
        <>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {response && <div className="mb-2 w-full h-fit flex "><ItemFullRender item={response.item} /></div>}
        </>   
    );
}

export default WorkerGetItem;