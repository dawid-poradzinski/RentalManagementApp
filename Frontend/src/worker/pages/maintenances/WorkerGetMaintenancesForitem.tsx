import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MaintenanceTypeEnum, ResponseErrorFromJSON, type MaintenanceEntity, type ResponseGetMultipleMaintenances } from "../../../../generated-ts/models";
import { MaintenancesApi, type V1ApiItemsIdMaintenancesGetRequest } from '../../../../generated-ts/apis/MaintenancesApi';
import { ResponseError } from "../../../../generated-ts/runtime";
import MaintenanceSmallRender from "../../addons/Renders/MaintenanceSmallRender";


type Filter = {types: MaintenanceTypeEnum[], from: Date | null, to: Date | null}

function WorkerGetMaintenancesForItem() {

    const { id } = useParams();
    const [maintenances, setMaintenances] = useState<ResponseGetMultipleMaintenances | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function getMaintenancesForId(num: string | undefined) {
            const numId = num ? Number(num) : NaN;
            if (Number.isNaN(numId) || numId < 0) {
                setError("id must be a number and be positive");
            } else {
                const api = new MaintenancesApi()
                const request: V1ApiItemsIdMaintenancesGetRequest = {
                    id: numId,
                    types: filter?.types,
                    ...(filter?.to ? {to: filter.to} : {} ),
                    ...(filter?.from ? {from: filter.from} : {} )
                }
                
                try {
                    const response = await api.v1ApiItemsIdMaintenancesGet(request)
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

    }, [id, filter])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const selectedValues = formData.getAll("types") as string[]
        
        const validTypes = selectedValues.filter(val => Object.values(MaintenanceTypeEnum).includes(val as MaintenanceTypeEnum) ) as MaintenanceTypeEnum[]
        const from = formData.get("from")
        let fromDate: Date | null = null

        if (typeof from === "string" && from.trim() !== "") {
            fromDate = new Date(from);
        }

        const to = formData.get("to")
        let toDate: Date | null = null

        if (typeof to === "string" && to.trim() !== "") {
            toDate = new Date(to);
        }

        const newFilter: Filter = {
            types: validTypes,
            from: fromDate,
            to: toDate
        }

        if (JSON.stringify(filter) !== JSON.stringify(newFilter)) {
            setFilter(newFilter)
        }
        
    }
    
    return(
        <div className="grid-container">
            <div className="grid-filter">
                <form onSubmit={handleSubmit} className="grid-form">
                    <div className="w-full">
                        <div className="font-semibold text-3xl">
                            Filters
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">Maintenance Type</label>
                        <select
                            multiple
                            onChange={() => {}}
                            className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                            name="types"
                        >       <option key='empty' value={""}>
                                    -        
                                </option>
                            {Object.values(MaintenanceTypeEnum).map((typeValue) => (
                                <option key={typeValue} value={typeValue}>
                                    {typeValue}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div>
                            <p className="w-full">From</p>
                            <div className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 w-full">
                                <div className="flex w-full relative">
                                    <input type="date" name="from" className="stroke-white border-white w-full"></input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="w-full">To</p>
                            <div className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 w-full">
                                <div className="flex w-full relative">
                                    <input type="date" name="to" className="stroke-white border-white w-full"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center static">
                        <div className="w-full flex justify-center">
                            <button type="submit" className="bg-indigo-700 rounded-xl p-4 py-3 w-[80%] text-white text-center cursor-pointer">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <section className="grid-section">
                <div className="grid-name">
                    List of Maintenances for Item #{id}
                </div>
                <div className="grid-page-setter">
                    <div className="grid-render">
                        {maintenances?.maintenance && maintenances.maintenance.length > 0 ? (
                            maintenances.maintenance.map((maintenance: MaintenanceEntity) => (
                                <MaintenanceSmallRender key={maintenance.id} maintenance={maintenance} />
                            ))
                        ) : (
                            <div>not found</div>
                        )}
                    </div>
                    <div className="w-full h-[6%]">
                        {maintenances?.pages != undefined ? (
                            maintenances.pages.currentPage
                        ) : (
                            <>Waiting for loading</>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default WorkerGetMaintenancesForItem