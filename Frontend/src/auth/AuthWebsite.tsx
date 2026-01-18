import { useState } from "react"
import AuthLogin from "./AuthLogin"
import { Outlet } from "react-router-dom"

function AuthWebsite() {

    const [login, setLogin] = useState<boolean>(true)

    return(
        <div className="w-full h-full p-4 flex items-center justify-center">
            <Outlet />
        </div>
    )
}

export default AuthWebsite