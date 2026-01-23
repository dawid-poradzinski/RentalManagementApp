import { Outlet } from "react-router-dom"

function AuthWebsite() {

    return(
        <div className="w-full h-full p-4 flex items-center justify-center">
            <Outlet />
        </div>
    )
}

export default AuthWebsite