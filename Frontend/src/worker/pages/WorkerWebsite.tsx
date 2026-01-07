import { Outlet } from "react-router-dom";

function WorkerWebsite() {
    return (
    <div className="h-screen flex flex-col">
      <header className="h-20 w-full bg-gray-900 shadow-xl backdrop-blur-lg">

      </header>
      <div className="w-full h-full flex flex-row">
        <main className="w-full h-full">
            <div className="p-10 flex w-full h-full">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  )
}

export default WorkerWebsite;