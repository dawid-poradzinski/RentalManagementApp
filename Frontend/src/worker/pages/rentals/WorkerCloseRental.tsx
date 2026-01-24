import { useLocation, useParams } from "react-router-dom";
import type { FullRentalEntity, ResponseErrorModel, ResponseGetSingleRental } from "../../../../generated-ts/models";
import { useState } from "react";

function WorkerCloseRental() {

    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const {state} = useLocation()
    const rental = state as FullRentalEntity

}

export default WorkerCloseRental