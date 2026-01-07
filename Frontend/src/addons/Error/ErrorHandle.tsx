import { ResponseErrorModelFromJSON, type ResponseErrorModel } from "../../../generated-ts/models";
import DefaultErrorMessage from "./DefaultErrorMessage";

async function ErrorHandle(err: any, setError: React.Dispatch<React.SetStateAction<ResponseErrorModel | null>>) {
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

export default ErrorHandle