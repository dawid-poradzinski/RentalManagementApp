function FakeLoadingAddMaintenance() {
    return(
        <div className="w-full h-full flex items-center animate-pulse">
            <div className="w-1/2 h-3/4 bg-white/7 mx-auto rounded-xl backdrop-blur-xl shadow-xl flex flex-col gap-4 p-4">
                <div className="w-full h-3/7 flex flex gap-4">
                    <div className="w-2/3 h-full bg-gray-700/20 rounded-xl backdrop-blur-xl shadow-xl">

                    </div>
                    <div className="w-1/3 h-full bg-gray-700/20 flex items-center justify-center rounded-xl backdrop-blur-xl shadow-xl">
                    </div>
                </div>
                <div className="w-full h-4/7 flex flex-col gap-4">
                    <textarea className="w-full h-4/5 bg-gray-700/20 border-none rounded-xl p-2">

                    </textarea>
                    <div className="w-full h-1/5 flex items-center justify-center">
                        <div className="py-6 px-15 bg-gray-700/20 rounded-xl backdrop-blur-xl shadow-xl cursor-pointer transition-transform transform hover:-translate-y-1"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FakeLoadingAddMaintenance