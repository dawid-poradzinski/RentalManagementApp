import { useContext, useState } from "react"
import { AuthContext } from "./AuthContext"
import { IconUser } from "@tabler/icons-react";

function LoggedBurger() {
    const {user, logoutUser} = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleClick = () => {
        setIsOpen(!isOpen);
    }; 

    return(
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button  className="flex items-center gap-2 text-xl cursor-pointer p-2 bg-gray-700 rounded cursor-pointer">
                <IconUser stroke={2} size={30} />
                <span>{user?.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 w-full bg-gray-700 shadow-lg rounded-b-md flex flex-col z-50 text-base text-white">
                    <div className="border-b p-2">
                        User settings
                    </div>

                    <button onClick={logoutUser} className="text-left px-2 py-1 hover:bg-slate-300/20 rounded cursor-pointer" >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default LoggedBurger