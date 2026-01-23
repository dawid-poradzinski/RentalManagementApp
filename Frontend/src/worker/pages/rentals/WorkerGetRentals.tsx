import { useEffect, useState } from "react";
import { PlacesEnum, RentalStatusTypeEnum, type ResponseErrorModel, type ResponseGetMultipleRentals } from "../../../../generated-ts/models"
import FakeLoadingFooter from "../../../addons/Fake/FakeLoadingFooter";
import PaginationFooter from "../../../addons/PaginationFooter";
import ErrorMessage from "../../../addons/Error/ErrorMessage";
import FakeLoading from "../../../addons/Fake/FakeLoading";
import RentalSmallRender from "../../addons/Renders/RentalSmallRender";
import FakeLoadingItem from '../../../addons/Fake/FakeLoadingItem';
import { RentalsApi, type V1ApiRentalsGetRequest } from '../../../../generated-ts/apis/RentalsApi';
import { Configuration } from "../../../../generated-ts/runtime";
import ErrorHandle from "../../../addons/Error/ErrorHandle";

type Filter = {name: string | null, surname: string | null, phone: string | null,  status: RentalStatusTypeEnum, place: PlacesEnum | null}


function WorkerGetRentals() {

    const [response, setResponse] = useState<ResponseGetMultipleRentals | null>(null)
    const [filter, setFilter] = useState<Filter>()
    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [firstRender, setFirstRender] = useState<boolean>(true)

    useEffect(() => {
        async function GetRentals() {
            if (firstRender) {
                setFirstRender(false)
                return
            }
            const api = new RentalsApi(new Configuration({
                credentials: "include"
            })) 

            const request: V1ApiRentalsGetRequest = {
                page: page,
                size: pageSize,
                ...(filter?.phone ? {phone: filter.phone} : {}),
                ...(filter?.name ? {name: filter.name} : {}),
                ...(filter?.place ? {place: filter.place} : {}),
                ...(filter?.surname ? {surname: filter.surname} : {}),
                ...(filter?.status ? {status: filter.status} : {})
            }
            console.log(request)
            try {
                setResponse(await api.v1ApiRentalsGet(request))
            } catch (error: any) {
                ErrorHandle(error, setError)
            }
        }
        GetRentals()
    }, [filter, page, pageSize])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        let phone: string | null = null
        let name: string | null = null
        let surname: string | null = null

        
        const formName = formData.get("name")
        if (typeof formName === "string" && formName.trim() !== "") {
            name = formName;
        }

        const formSurname = formData.get("name")
        if (typeof formSurname === "string" && formSurname.trim() !== "") {
            surname = formSurname;
        }

        const place = formData.get("place") as PlacesEnum
        const status = formData.get("status") as RentalStatusTypeEnum

        const formPhone = formData.get("phone") as string

        if (typeof formPhone === "string" && formPhone.trim() !== "") {
            phone = formPhone
        }

        const newFilter: Filter = {
            name: name,
            phone: phone,
            place: place,
            status: status,
            surname: surname
        }

        console.log(newFilter)

        if (JSON.stringify(filter) !== JSON.stringify(newFilter)) {
            setFilter(newFilter)
        }

    }

    return(
        <div className="grid-container">
            {error !== null ? (<ErrorMessage error={error} setError={setError} />) : (<></>)}
            <div className="grid-filter">
                <form onSubmit={handleSubmit}  className="grid-form">
                    <div className="w-full">
                        <div className="font-semibold text-3xl">
                            Filters
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="place" className="block text-sm font-medium mb-2">Places</label>
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
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                            <input
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="phone" type="phone" placeholder="575434831">
                            </input>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                            <input
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="name" placeholder="Adam">
                            </input>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="surname" className="block text-sm font-medium mb-2">Surname</label>
                            <input
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="surnname" placeholder="Nowak">
                            </input>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="status" className="block text-sm font-medium mb-2">Rental Status</label>
                            <select
                                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                                name="status">
                                    <option key='empty' value={""}>
                                        -
                                    </option>
                                    {Object.values(RentalStatusTypeEnum).map((value) => (
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
                    List of Rentals
                </div>
                <div className="grid-page-setter">
                    
                    {loading === true ? (
                        <FakeLoading fakeItem={FakeLoadingItem} />
                    ) : (
                        <>
                            <div className="grid-render grid-render-4">
                                {response?.rentals && response.rentals.length > 0 ? (
                                    response.rentals.map((rental) => (
                                        <RentalSmallRender rental={rental}/>
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

export default WorkerGetRentals