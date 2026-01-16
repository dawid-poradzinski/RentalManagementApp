import { useEffect, useState } from "react";
import { MaintenanceTypeEnum, type ErrorModel, type MaintenanceEntity, type ResponseGetMultipleMaintenances } from "../../../../generated-ts/models";
import { MaintenancesApi, type V1ApiMaintenancesGetRequest } from '../../../../generated-ts/apis/MaintenancesApi';
import MaintenanceSmallRender from "../../addons/Renders/MaintenanceSmallRender";
import FakeMaintenanceitem from '../../../addons/Fake/FakeMaintenanceItem';
import FakeLoading from "../../../addons/Fake/FakeLoading";import ErrorMessage from "../../../addons/Error/ErrorMessage";
import { ResponseErrorModelFromJSON, type ResponseErrorModel } from '../../../../generated-ts/models/ResponseErrorModel';
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import FakeLoadingFooter from "../../../addons/Fake/FakeLoadingFooter";
import PaginationFooter from "../../../addons/PaginationFooter";
import ErrorHandle from "../../../addons/Error/ErrorHandle";


type Filter = {types: MaintenanceTypeEnum[], from: Date | null, to: Date | null}

function WorkerGetMaintenances() {

    const [maintenances, setMaintenances] = useState<ResponseGetMultipleMaintenances | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    
    useEffect(() => {
        async function getMaintenances() {
            const api = new MaintenancesApi()
            const request: V1ApiMaintenancesGetRequest = {
                page: page,
                size: pageSize,
                types: filter?.types,
                ...(filter?.to ? {to: filter.to} : {} ),
                ...(filter?.from ? {from: filter.from} : {} )
            }            
            try {
                const response = await api.v1ApiMaintenancesGet(request)
                setMaintenances(response)
            } catch (err: any) {
                await ErrorHandle(err, setError)
            }
            setLoading(false)
        }
        getMaintenances()
    }, [filter, page, pageSize])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const selectedValues = formData.getAll("types") as string[]
        
        const validTypes = selectedValues.filter(val => Object.values(MaintenanceTypeEnum).includes(val as MaintenanceTypeEnum) ) as MaintenanceTypeEnum[]
        const from = formData.get("from")
        let fromDate: Date | null = null

        if (typeof from === "string" && from.trim() !== "") {
            fromDate = new Date(from);
            console.log(fromDate)
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
                    <div className="w-full flex justify-center">
                        <button type="submit" className="bg-indigo-700 rounded-xl p-4 py-3 w-[80%] text-white text-center cursor-pointer">
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <section className="grid-section">
                <div className="grid-name">
                    List of Maintenances
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

export default WorkerGetMaintenances