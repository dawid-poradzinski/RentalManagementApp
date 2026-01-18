import { useEffect, useState } from "react";
import { ItemsApi, type V1ApiItemsGetRequest } from '../../../../generated-ts/apis/ItemsApi';
import ItemSmallRender from "../../addons/Renders/ItemSmallRender";
import FakeLoading from "../../../addons/Fake/FakeLoading";
import FakeLoadingItem from "../../../addons/Fake/FakeLoadingItem";
import { PlacesEnum, ResponseErrorModelFromJSON, SizeEnum, type ErrorModel, type ResponseErrorModel, type ResponseGetMultipleItems } from "../../../../generated-ts/models";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import FakeLoadingFooter from "../../../addons/Fake/FakeLoadingFooter";
import PaginationFooter from "../../../addons/PaginationFooter";
import { Configuration } from "../../../../generated-ts/runtime";

type Filter = {category: string | null, damaged: boolean | null, itemSize: SizeEnum | null, place: PlacesEnum | null}

function WorkerGetItems() {

    const [response, setResponse] = useState<ResponseGetMultipleItems | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)

    useEffect(() => {

        async function getItems() {
            const api = new ItemsApi(new Configuration({
                credentials: "include"
            }))
            const request: V1ApiItemsGetRequest = {
                page: page,
                size: pageSize,
                ...(filter?.category ? {category: filter.category} : {} ),
                ...(typeof filter?.damaged === "boolean" ? {damaged: filter.damaged} : {} ),
                ...(filter?.itemSize ? {itemSize: filter.itemSize} : {} ),
                ...(filter?.place ? {place: filter.place} : {} ),
            }

            try {
                setResponse(await api.v1ApiItemsGet(request))
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
        getItems()
    }, [filter, page, pageSize])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        let damaged: boolean | null = null
        let category: string | null = null
        let itemSize: SizeEnum | null = null
        let place: PlacesEnum | null = null

        const formDamaged = formData.get('damaged')
        if (typeof formDamaged === "string" && formDamaged.toString().trim() !== "") {
            damaged = formDamaged.toString() == "yes"
        }

        const formCategory = formData.get("category")
        if (typeof formCategory === "string" && formCategory.toString().trim() !== "") {
            category = formCategory.toString();
        }

        itemSize = formData.get("itemSize") as SizeEnum

        place = formData.get("place") as PlacesEnum

        const newFilter: Filter = {
            category: category,
            damaged: damaged,
            itemSize: itemSize,
            place: place
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
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">Damaged</label>
                            <select
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="damaged">
                                    <option key='empty' value={""}>
                                        -
                                    </option>
                                    <option key='yes' value={"yes"}>
                                        yes
                                    </option>
                                    <option key='no' value={"no"}>
                                        false
                                    </option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="category">
                                    <option key='empty' value={""}>
                                        -
                                    </option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">Sizes</label>
                            <select
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="itemSize">
                                    <option key='empty' value={""}>
                                        -
                                    </option>
                                    {Object.values(SizeEnum).map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">Places</label>
                            <select
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="place">
                                    <option key='empty' value={""}>
                                        -
                                    </option>
                                    {Object.values(PlacesEnum).map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <button type="submit" className="bg-indigo-700 rounded-xl p-4 py-3 w-[80%] text-white text-center cursor-pointer lg:mb-4">
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <section className="grid-section">
                <div className="grid-name">
                    List of Items
                </div>
                <div className="grid-page-setter">
                    
                    {loading === true ? (
                        <FakeLoading fakeItem={FakeLoadingItem} />
                    ) : (
                        <>
                            <div className="grid-render grid-render-items-full ">
                                {response?.items && response.items.length > 0 ? (
                                    response.items.map((item) => (
                                        <ItemSmallRender item={item}/>
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
                    <PaginationFooter numberOfPages={response?.pages.numberOfPages ?? 0} currentPage={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} />
                )}
            </section>
        </div>
    )
}

export default WorkerGetItems