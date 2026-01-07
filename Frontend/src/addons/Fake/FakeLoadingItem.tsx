function FakeLoadingItem() {
    return(
        <div className="w-full h-full bg-slate-50/20 shadow-xl rounded-xl backdrop-blur-xl flex flex-col items-center p-2 py-4 gap-4">
            <div className="h-23 w-23 bg-slate-800/20 rounded-4xl"></div>
            <div className="flex flex-col w-full gap-4">
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
                <div className="w-full h-6 p-1 text-center bg-slate-800/20 backdrop-blur-lg rounded-xl shadow-md"></div>
            </div>
        </div>
    )
}

export default FakeLoadingItem