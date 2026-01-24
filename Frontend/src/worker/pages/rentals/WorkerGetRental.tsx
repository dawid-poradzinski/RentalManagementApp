import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ResponseErrorModel, ResponseGetSingleRental } from "../../../../generated-ts/models";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import { RentalsApi, type V1ApiRentalsIdGetRequest } from "../../../../generated-ts/apis/RentalsApi";
import { Configuration } from "../../../../generated-ts/runtime";
import ErrorHandle from "../../../addons/Error/ErrorHandle";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import RentalFullRender from "../../addons/Renders/RentalFullRender";

function WorkerGetRental() {
    
    const { id } = useParams();
    const [rental, setRental] = useState<ResponseGetSingleRental | null>(null)
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    
    useEffect(() => {

        async function getRentalForId(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Id not a possitive number", "id must be a number and be positive")]
                }
                setError(error);
            } else {
                const api = new RentalsApi(new Configuration({
                    credentials: "include"
                }))
                const request: V1ApiRentalsIdGetRequest = {
                    id: numId,
                }
                
                try {
                    const response = await api.v1ApiRentalsIdGet(request)
                    setRental(response)
                } catch (err: any) {
                    await ErrorHandle(err, setError)
                }
            }
        }

        getRentalForId(id)

    }, [id])

    return(
        <div className="w-full xl:w-[50%] 2xl:w-[45%] h-fit bg-gray-200/20 rounded-xl mx-auto p-2 xl:p-6 shadow-xl backdrop-blur-sm flex flex-col gap-4">
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            {rental && <RentalFullRender rental={rental?.rental} />}
        </div>
    )
}

export default WorkerGetRental