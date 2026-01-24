import { Link, useLocation, useNavigate, useNavigation } from "react-router-dom"
import type { ItemEntity, ResponseItemCheck } from "../../../generated-ts/models"
import { useContext, useEffect, useState } from "react"
import { type ItemInKoszyk, ShopContext } from '../ShopContext';
import ItemAfterCheckRender from "../addons/renders/ItemAfterCheckRender";

function ItemCheckResult() {
    const {changeKoszyk, setToken, shopInfo, clearKoszyk} = useContext(ShopContext)
    const {state} = useLocation()
    const response = state as ResponseItemCheck
    const [valid, setValid] = useState<ItemInKoszyk[]>()
    const [notValid, setNotValid] = useState<ItemInKoszyk[]>()
    const navigate = useNavigate()

    function mapToItemInKoszyk(items: ItemEntity[]) {
        return items.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            image: item.image,
            price: item.price
        }))
    }

    function handleAfterFlightCheck() {
        const validFromResponse = mapToItemInKoszyk(response.valid)
        setValid(validFromResponse)
        setNotValid(mapToItemInKoszyk(response.notValid))

        changeKoszyk(validFromResponse)

        if (shopInfo?.token !== response.token) {
            setToken(response.token)
        }
    }

    useEffect(() => {
        if (state === undefined) {
            return
        }
        handleAfterFlightCheck()
    }, [])

    return(
        <div className="w-9/10 h-full mx-auto flex flex-col p-2 bg-linear-to-tl from-white/7 to-white/10 shadow-xl rounded-xl backdrop-blur-xl">
            <div className="w-full h-full flex gap-4 my-5 flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-full flex flex-col">
                    <span className="text-3xl font-bold text-center w-full h-fit">
                        Available items:
                    </span>
                    <div className="w-full h-full max-h-155 overflow-y-auto">
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                            {valid && valid.length > 0 ? (
                                    valid.map((item) => (
                                        <ItemAfterCheckRender item={item} valid={true} setValid={setValid} />
                                    ))
                                ) : (
                                    <div>not found</div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 h-full flex flex-col">
                    <span className="text-3xl font-bold text-center w-full h-fit">
                        Not available items:
                    </span>
                    <div className="w-full h-full max-h-155 overflow-y-auto">
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                            {notValid && notValid.length > 0 ? (
                                    notValid.map((item) => (
                                        <ItemAfterCheckRender item={item} valid={false} setValid={setNotValid} />
                                    ))
                                ) : (
                                    <div>not found</div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-fit p-4 flex justify-between font-bold text-xl flex-col xl:flex-row gap-4 xl:gap-0">
                <button onClick={() => {clearKoszyk(), navigate("/")}} className="bg-linear-to-tl from-yellow-300 to-amber-300 py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">Cancel</button>
                <Link to="/refresh" className="bg-linear-to-bl from-sky-600 to-indigo-700 text-white py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">Add items</Link>
                {valid?.length ? (<Link to={"/shop"} className="bg-linear-to-bl from-lime-500 to-green-500 py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">Rent</Link>) : (<></>)}
            </div>
        </div>
    )
}

export default ItemCheckResult