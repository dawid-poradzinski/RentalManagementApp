import { useContext, useState } from "react"
import { AuthContext } from "./AuthContext"
import { IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function LoggedBurger() {
    const {user, logoutUser} = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleClick = () => {
        setIsOpen(!isOpen);
    }; 

    return(
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button  className="flex items-center gap-2 text-xl cursor-pointer p-2 bg-gray-700/90 rounded cursor-pointer">
                <IconUser stroke={2} size={30} />
                <span>{user?.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 w-full bg-gray-700/90 shadow-lg rounded-b-md flex flex-col z-50 text-base text-white">
                    <div className="border-b p-2">
                        User settings
                    </div>
                    
                    {user?.rank === "ADMIN" || user?.rank === "WORKER" ? (<Link to={"/worker"} className="text-left px-2 py-1 hover:bg-slate-300/20 rounded cursor-pointer">Worker Menu</Link>) : (<></>)}

                    <button onClick={logoutUser} className="text-left px-2 py-1 hover:bg-slate-300/20 rounded cursor-pointer" >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default LoggedBurger