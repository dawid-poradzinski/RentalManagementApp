import type React from "react";

function FakeMaintenanceitem() {
    return(
        <div className="w-full h-full bg-slate-50/30 shadow-xl backdrop-blur-xl rounded-xl flex p-4 py-6 gap-2 relative">
            <div className="w-19 h-7 absolute top-[0%] left-[50%] translate-[-50%] text-white font-semibold bg-slate-800/20 rounded-xl shadow-md backdrop-blue-lg py-1 px-3">

            </div>
            <div className="flex flex-col w-[60%] gap-2">
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
                <div className="w-full h-12 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
            </div>
            <div className="flex w-[40%] h-full items-center justify-center">
                <div className="w-28 h-28 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
            </div>
        </div>
    )
}

export default FakeMaintenanceitem