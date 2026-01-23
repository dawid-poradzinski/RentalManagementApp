import { useContext, useEffect, useState } from "react";
import { PlacesEnum, SizeEnum, type RentalDate, type ResponseErrorModel, type ResponseGetMultipleItems } from "../../../generated-ts/models";
import ErrorMessage from "../../addons/Error/ErrorMessage";
import FakeLoadingFooter from "../../addons/Fake/FakeLoadingFooter";
import PaginationFooter from "../../addons/PaginationFooter";
import FakeLoading from "../../addons/Fake/FakeLoading";
import FakeLoadingItem from "../../addons/Fake/FakeLoadingItem";
import { AvailabilityApi, type V1ApiShopItemRefreshGetRequest } from '../../../generated-ts/apis/AvailabilityApi';
import { Configuration } from "../../../generated-ts/runtime";
import ErrorHandle from "../../addons/Error/ErrorHandle";
import RefreshItemRender from "../addons/renders/RefreshItemRender";
import { ShopContext, type ShopInfo } from "../ShopContext";

type Filter = {category: string | null, itemSize: SizeEnum | null, place: PlacesEnum, dates: RentalDate}

function ItemRefresh() {

    const { shopInfo, updateShopInfo} = useContext(ShopContext)
    const [response, setResponse] = useState<ResponseGetMultipleItems | null>(null)
    const [filter, setFilter] = useState<Filter>({dates: shopInfo?.date ? shopInfo.date :{
        from: new Date(calculateTime(2)),
        to: new Date(calculateTime(6))
    }, category: null, itemSize: null, place: shopInfo?.place ? shopInfo.place : PlacesEnum.FoppoloIt})
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    

        useEffect(() => {

        async function getItems() {
            const api = new AvailabilityApi(new Configuration({
                credentials: "include"
            }))
            const request: V1ApiShopItemRefreshGetRequest = {
                page: page,
                size: pageSize,
                from: new Date(filter.dates.from),
                to: new Date(filter.dates.to),
                place: filter.place,
                ...(filter?.category ? {category: filter.category} : {} ),
                ...(filter?.itemSize ? {itemSize: filter.itemSize} : {} ),
            }
            try {
                const response = await api.v1ApiShopItemRefreshGet(request)
                setResponse(response)
                const newShopInfo: ShopInfo = {
                    date: {
                        from: request.from,
                        to: request.to
                    },
                    place: request.place,
                    token: shopInfo?.token
                }
                updateShopInfo(newShopInfo)
                if(response!.pages!.currentPage! >= response!.pages!.numberOfPages!) {
                    setPage(response.pages.numberOfPages!)
                }
            } catch (err: any) {
                ErrorHandle(err, setError)
            }
            setLoading(false)
        }
        getItems()
    }, [filter, page, pageSize])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        let category: string | null = null
        let itemSize: SizeEnum | null = null
        let place: PlacesEnum | null = null

        const formCategory = formData.get("category")
        if (typeof formCategory === "string" && formCategory.toString().trim() !== "") {
            category = formCategory.toString();
        }

        itemSize = formData.get("itemSize") as SizeEnum
        place = formData.get("place") as PlacesEnum
        const fromForm = formData.get("from") as string
        const toForm = formData.get("to") as string

        const newFilter: Filter = {
            category: category,
            itemSize: itemSize,
            place: place,
            dates: {
                from: new Date(fromForm),
                to: new Date(toForm)
            }
        }

        if (JSON.stringify(filter) !== JSON.stringify(newFilter)) {
            setFilter(newFilter)
        }
    }


    function calculateTime(hoursToAdd: number) {
        const now = Date.now()
        const oneHour = 1000 * 60 * 60
        return roundTime(now + oneHour * hoursToAdd)
    }

    function roundTime(dateNumber: string | number | Date): string {
        const date = new Date(dateNumber)
        const minutes = date.getMinutes();
        const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
        if (minutes >= 45) {
            date.setHours(date.getHours() + 1);
        }
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(roundedMinutes)}`
    }

    
    return(
        <div className="grid-container">
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            <div className="grid-filter">
                <div className="grid-form-refresh-before">
                    <form onSubmit={handleSubmit} className="grid-form-refresh">
                        <div className="w-full">
                            <div className="font-semibold text-3xl">
                                Filters
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">From</label>
                                <input name="from" type="datetime-local" defaultValue={roundTime(filter.dates.from)} onInput={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = roundTime(e.target.value)
                                }}  className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"></input>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">To</label>
                                <input name="to" type="datetime-local" defaultValue={roundTime(filter.dates.to)} onInput={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = roundTime(e.target.value)
                                }} className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"></input>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">Places</label>
                                <select
                                    className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                    name="place" defaultValue={shopInfo?.place ? shopInfo.place : PlacesEnum.FoppoloIt}>
                                        {Object.values(PlacesEnum).map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
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
                        <div className="w-full flex justify-center">
                            <button type="submit" className="bg-linear-to-bl from-sky-600 to-indigo-700 rounded-xl p-4 py-3 w-[80%] text-white text-center cursor-pointer lg:mb-4">
                                Search
                            </button>
                        </div>
                    </form>
                    <div className="grid-form-refresh">
                        <div className="text-3xl text-red-700 font-bold">
                            Promotions!
                        </div>
                        <div className="w-full flex bg-gray-700 text-white rounded-lg p-2 border border-gray-600">
                            <span className="w-fit">
                                +4hours:
                            </span>
                            <span className="w-full text-center text-red-500 text-xl font-bold">
                                -55%!
                            </span>
                        </div>
                        <div className="w-full flex bg-gray-700 text-white rounded-lg p-2 border border-gray-600">
                            <span className="w-fit">
                                +24hours:
                            </span>
                            <span className="w-full text-center text-red-500 text-xl font-bold">
                                -85%!
                            </span>
                        </div>
                    </div>
                </div>
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
                                        <RefreshItemRender item={item} />
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

export default ItemRefresh