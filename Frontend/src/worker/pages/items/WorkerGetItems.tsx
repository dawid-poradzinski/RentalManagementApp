import { useEffect, useState } from "react";
import { ResponseError } from "../../../../generated-ts/runtime";
import { ItemsApi, type V1ApiItemsGetRequest } from '../../../../generated-ts/apis/ItemsApi';
import { ResponseErrorFromJSON, type ResponseGetMultipleItems } from "../../../../generated-ts/models";
import ItemSmallRender from "../../addons/Renders/ItemSmallRender";

type Filter = {category: string | null, damaged: boolean | null, itemSize: string | null, place: string | null}

function WorkerGetItems() {

    const [response, setResponse] = useState<ResponseGetMultipleItems | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function getItems() {
            const api = new ItemsApi()
            const request: V1ApiItemsGetRequest = {
                ...(filter?.category ? {category: filter.category} : {} ),
                ...(typeof filter?.damaged === "boolean" ? {damaged: filter.damaged} : {} ),
                ...(filter?.itemSize ? {itemSize: filter.itemSize} : {} ),
                ...(filter?.place ? {place: filter.place} : {} ),
            }
            console.log(request)
            try {
                setResponse(await api.v1ApiItemsGet(request))
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
        getItems()
    }, [filter])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        let damaged: boolean | null = null
        let category: string | null = null
        let itemSize: string | null = null
        let place: string | null = null

        const formDamaged = formData.get('damaged')
        if (typeof formDamaged === "string" && formDamaged.toString().trim() !== "") {
            damaged = formDamaged.toString() == "yes"
        }

        const formCategory = formData.get("category")
        if (typeof formCategory === "string" && formCategory.toString().trim() !== "") {
            category = formCategory.toString();
        }

        const formSize = formData.get("itemSize")
        if (typeof formSize === "string" && formSize.toString().trim() !== "") {
            itemSize = formSize.toString();
        }

        const formPlace = formData.get("place")
        if (typeof formPlace === "string" && formPlace.toString().trim() !== "") {
            place = formPlace.toString();
        }

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
                                    <option key='s' value={"s"}>
                                        S
                                    </option>
                                    <option key='m' value={"m"}>
                                        M
                                    </option>
                                    <option key='l' value={"l"}>
                                        L
                                    </option>
                                    <option key='xl' value={"xl"}>
                                        XL
                                    </option>
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
                                    <option key='Bialka Tatrzanska, PL' value={"Bialka Tatrzanska, PL"}>
                                        Bialka Tatrzanska, PL
                                    </option>
                                    <option key='Krakow, PL' value={"Krakow, PL"}>
                                        Krakow, PL
                                    </option>
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
                    <div className="grid-render">
                        {response?.items && response.items.length > 0 ? (
                            response.items.map((item) => (
                                <ItemSmallRender item={item}/>
                            ))
                        ) : (
                            <div>not found</div>
                        )}
                    </div>
                    <div className="w-full h-fit">
                        {response?.pages != undefined ? (
                            response.pages.currentPage
                        ) : (
                            <>Waiting for loading</>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default WorkerGetItems