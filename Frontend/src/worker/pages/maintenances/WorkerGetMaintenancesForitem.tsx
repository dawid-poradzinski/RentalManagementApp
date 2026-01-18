import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MaintenanceTypeEnum, ResponseErrorModelFromJSON, type MaintenanceEntity, type ResponseErrorModel, type ResponseGetMultipleMaintenances } from "../../../../generated-ts/models";
import { MaintenancesApi, type V1ApiItemsIdMaintenancesGetRequest } from '../../../../generated-ts/apis/MaintenancesApi';
import MaintenanceSmallRender from "../../addons/Renders/MaintenanceSmallRender";
import FakeLoading from "../../../addons/Fake/FakeLoading";
import FakeMaintenanceitem from "../../../addons/Fake/FakeMaintenanceItem";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import FakeLoadingFooter from "../../../addons/Fake/FakeLoadingFooter";
import PaginationFooter from "../../../addons/PaginationFooter";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import { Configuration } from "../../../../generated-ts/runtime";


type Filter = {types: MaintenanceTypeEnum[], from: Date | null, to: Date | null}

function WorkerGetMaintenancesForItem() {

    const { id } = useParams();
    const [maintenances, setMaintenances] = useState<ResponseGetMultipleMaintenances | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<ResponseErrorModel | null>(null)
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)

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
                const request: V1ApiItemsIdMaintenancesGetRequest = {
                    page: page,
                    size: pageSize,
                    id: numId,
                    types: filter?.types,
                    ...(filter?.to ? {to: filter.to} : {} ),
                    ...(filter?.from ? {from: filter.from} : {} )
                }
                
                try {
                    const response = await api.v1ApiItemsIdMaintenancesGet(request)
                    setMaintenances(response)
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
                setLoading(false)
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
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
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

                    {loading === true ? (
                        <FakeLoading fakeItem={FakeMaintenanceitem} />
                    ) : (
                        <>
                            <div className="grid-render grid-render-maintenance">
                                {maintenances?.maintenance && maintenances.maintenance.length > 0 ? (
                                    maintenances.maintenance.map((maintenance: MaintenanceEntity) => (
                                        <MaintenanceSmallRender key={maintenance.id} maintenance={maintenance} />
                                    ))
                                ) : (
                                    <div>not found</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {loading === true ? (
                    <FakeLoadingFooter />
                ) : (
                    <PaginationFooter numberOfPages={maintenances?.pages.numberOfPages ?? 0} currentPage={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} />
                )}
            </section>
        </div>
    )
}

export default WorkerGetMaintenancesForItem