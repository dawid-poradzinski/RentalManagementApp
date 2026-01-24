import { useContext, useState } from "react";
import type { ResponseErrorModel } from "../../../../generated-ts/models";
import DefaultErrorMessage from "../../../addons/Error/DefaultErrorMessage";
import { AuthContext } from "../../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../../addons/Error/ErrorMessage";

function ItemShopBuyer() {

    const {user} = useContext(AuthContext)
    const [error, setError] = useState<ResponseErrorModel | null>(null)
    const [noRegister, setNoRegister] = useState<boolean>(false)
    const navigate = useNavigate()

    function handleForm(e: React.FormEvent<HTMLFormElement>) {
    
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
    
            const name = formData.get("name")
    
            if (typeof name !== "string" || name.trim() === "") {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Name input error", "Name cannot be empty")]
                }
                setError(error)
                return
            }
    
            const surname = formData.get("surname")
    
            if (typeof surname !== "string" || surname.trim() === "") {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Surname input error", "Surname cannot be empty")]
                }
                setError(error)
                return
            }
    
            const phone = formData.get("phone")
    
            if (typeof phone !== "string" || phone.trim() === "" || phone.length != 9) {
                const error : ResponseErrorModel = {
                    timestamp: new Date(),
                    errors: [DefaultErrorMessage("Phone input error", "Phone cannot be empty")]
                }
                setError(error)
                return
            }
    
            const buyerEntity = {
                name: name as string,
                phone: phone as string,
                surname: surname as string,
                ...(user?.id ? {personId: user.id} : {})
            }
    
            navigate("/shop/summary", {state: buyerEntity})
        }

    return(
        
        <div className="w-9/10 mx-auto h-full p-4 flex bg-linear-to-tl from-white/7 to-white/10 shadow-xl rounded-xl backdrop-blur-sm items-center justify-center">
            {error !== null ? (<ErrorMessage error={error} setError={setError}/>) : (<></>)}
            {user || noRegister ? (
                <form onSubmit={handleForm} className="w-fit h-fit min-h-2/3 p-4  px-10 flex flex-col justify-around">
                    <span className="font-bold text-3xl">
                        Your informations
                    </span>
                    <div className="w-full h-fit flex flex-col gap-2 justify-center">
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input name="name" className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600" defaultValue={user?.name} required></input>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">Surname</label>
                                <input name="surname" className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600" defaultValue={user?.surname} required></input>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input name="phone" className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600" defaultValue={user?.phone} required></input>
                            </div>
                        </div>
                        <button className="w-full text-center bg-linear-to-bl from-sky-600 to-indigo-700 text-white py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">
                            Next
                        </button>
                    </div>
                </form>
            ) : (
                <div className="w-1/3 h-1/3 flex p-4 flex-col gap-4 items-center">
                    <span className="w-full h-fit text-3xl font-bold text-center">Check who I am</span>
                    <div className="w-fit h-full flex flex-col gap-2 items-center justify-center">
                        <Link to={"/auth/login"} className="w-full text-center bg-linear-to-bl from-sky-600 to-indigo-700 text-white py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">
                        Login
                        </Link>
                        <Link to={"/auth/login"} className="w-full text-center bg-linear-to-bl from-sky-600 to-indigo-700 text-white py-2 px-10 rounded-xl shadow-xl backdrop-blur-xl cursor-pointer transition-transform transform hover:-translate-y-1">
                        Register
                        </Link>
                        <span onClick={() => setNoRegister(true)} className="w-full text-center cursor-pointer transition-transform transform hover:-translate-y-1">
                            I want to rent without registration
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemShopBuyer