import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RequestRegister, ResponseErrorModel } from "../../generated-ts/models";
import { AuthContext } from "./AuthContext";
import ErrorMessage from "../addons/Error/ErrorMessage";
import DefaultErrorMessage from "../addons/Error/DefaultErrorMessage";
import { AuthApi } from "../../generated-ts/apis/AuthApi";
import { Configuration } from "../../generated-ts/runtime";
import ErrorHandle from "../addons/Error/ErrorHandle";

function AuthRegister() {

    const [error, setError] = useState<ResponseErrorModel | null>(null);
    const navigation = useNavigate()
    const {refreshUser} = useContext(AuthContext)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const login = formData.get("login")
        if (typeof login !== "string" || login.trim() === "") {
            const error : ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Login input error", "Login cannot be empty")]
            }
            setError(error);
        }

        const password = formData.get("password")
        if (typeof password !== "string" || password.trim() === "") {
            const error : ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Password input error", "Password cannot be empty")]
            }
            setError(error);
        }

        const phone = formData.get("phone")
        if (typeof phone !== "string" || phone.length != 9) {
            const error : ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Phone input error", "Phobe cannot be empty")]
            }
            setError(error);
        }

        const name = formData.get("name")
        if (typeof name !== "string" || name.trim() === "") {
            const error : ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Name input error", "Name cannot be empty")]
            }
            setError(error);
        }

        const surname = formData.get("surname")
        if (typeof surname !== "string" || surname.trim() === "") {
            const error : ResponseErrorModel = {
                timestamp: new Date(),
                errors: [DefaultErrorMessage("Surname input error", "Surname cannot be empty")]
            }
            setError(error);
        }

        const api = new AuthApi(new Configuration({
            credentials: "include"
        }))
        const body: RequestRegister = {
            login: login as string,
            name: name as string,
            password: password as string,
            phone: phone as string,
            surname: surname as string
        }

        try {
            await api.v1ApiRegisterPost({requestRegister: body});
            refreshUser()
            navigation("/")
        } catch (error: any) {
            await ErrorHandle(error, setError)
        }
    }

    return(
        <div className="bg-gray-800 min-h-fit w-2/6 h-3/5 mx-auto p-8 shadow-xl backdrop-blur-xl rounded-xl text-white flex items-center">
            {error !== null ? (<ErrorMessage error={error} setError={setError}/>) : (<></>)}
            <div className="w-full h-fit flex flex-col gap-4">
                <div className="w-full h-20 text-5xl text-center flex justify-center items-center">
                    Register
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"login"}>Login</label>
                        <input type="text" name="login" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"password"}>Password</label>
                        <input type="password" name="password" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"phone"}>Phone</label>
                        <input type="tel" name="phone" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"name"}>Name</label>
                        <input type="text" name="name" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"surname"}>Surname</label>
                        <input type="text" name="surname" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <button className="bg-sky-500 px-10 py-2 rounded-xl cursor-pointer">
                        Register
                    </button>
                </form>
                <Link to={"/auth/login"} className="text-sm text-center cursor-pointer">
                    Already have account? login here
                </Link>
            </div>
        </div>
    )
}

export default AuthRegister;