import type { ErrorModel, ResponseErrorModel } from "../../../generated-ts/models";

type Props = {error: ResponseErrorModel | null; setError: React.Dispatch<React.SetStateAction<ResponseErrorModel | null>>}

function ErrorMessage(props: Props) {
    return(
        <div className="absolute w-full h-full backdrop-blur-md top-0 left-0 z-200 flex justify-center items-center text-white">
            <div className="w-150 h-120 bg-gray-800 rounded-xl shadow-xl backdrop-blur-xl relative flex flex-col">
                <div className="w-full h-20 bg-gray-700 rounded-xl flex justify-between p-4 items-center text-xl">
                    <div>
                        Error Occured
                    </div>
                    <div>
                        {props.error?.timestamp.toLocaleString()}
                    </div>
                </div>
                <div className="p-4 w-full h-full flex flex-col justify-between">
                    An error was encountered during the operation.
                    <div className="overflow-auto h-67 p-2 bg-gray-700/40 rounded w-full flex flex-col gap-2">
                        {props.error?.errors.map( (error, index) => (
                            <div className="flex flex-col gap-2 p-2 bg-gray-700/80 rounded-xl shadow-xl backdrop-blur-xl">
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Id: #{index}</div>
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Name: {error.fieldValue}</div>
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Category: {error.category}</div>
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Path: {error.fieldPath}</div>
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Field: {error.fieldName}</div>
                                <div className="p-1 bg-gray-200/20 rounded-xl backdrop-blur-md shadow-md">Message: {error.message}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button className="w-1/3 h-10 bg-blue-500 rounded-xl shadow-xl backdrop-blue-xl cursor-pointer" onClick={() => (props.setError(null))}>
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorMessage