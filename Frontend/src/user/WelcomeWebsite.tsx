import { IconCircleArrowDown

 } from "@tabler/icons-react"
import { Link } from "react-router-dom"

function WelcomeWebsite() {
    return(
        <div className="w-full h-full">
            <div className="w-full h-20 text-center mt-20">
                <h1 className="text-5xl mb-5">
                    Welcome to <span className="underline decoration-solid font-bold">Ski World Now</span>
                </h1>
                <p className="text-lg">
                    Fast, hourly ski-gear rentals available across four convenient Ski World Now locations - grab your equipment and hit the slopes without delay.
                </p>
            </div>
            <div className="w-full h-1/2 items-center justify-center gap-4 flex">
                <Link to="/refresh" className="bg-linear-to-bl from-sky-500 to-indigo-500 rounded-xl shadow-xl backdrop-blur-xl p-4 px-10 text-white cursor-pointer transition-transform transform hover:-translate-y-1 ">Rent now</Link>
                <button className="bg-linear-to-bl from-white to--200 rounded-xl shadow-xl backdrop-blur-xl p-4 px-7 text-black cursor-pointer transition-transform transform hover:-translate-y-1 ">View locations</button>
            </div>
            <div className="w-full h-fit flex items-center justify-center">
                <IconCircleArrowDown stroke={2} size={48} color="white" />
            </div>
        </div>
    )
}

export default WelcomeWebsite