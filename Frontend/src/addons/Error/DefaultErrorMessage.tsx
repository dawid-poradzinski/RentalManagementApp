import type { ErrorModel } from "../../../generated-ts/models"

function DefaultErrorMessage(category: string, message: string): ErrorModel {
    return {
        fieldValue: "Unexpected Error",
        category: category,
        message: message
    }
}

export default DefaultErrorMessage