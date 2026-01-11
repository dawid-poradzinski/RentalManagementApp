import { Link, Outlet, useNavigate } from "react-router-dom";

function WorkerWebsite() {

    const navigate = useNavigate();

    return (
    <div className="flex flex-col min-h-screen">
        <header className="sticky z-100 top-0 h-20 w-full bg-gray-800 shadow-xl backdrop-blur-lg text-white flex items-center px-10 text-3xl">
          <div onClick={() => navigate(-1)}>&lt;-</div>
          <Link to={"/worker"}>Menu</Link>
        </header>
        <div className="flex-1 w-full flex flex-row bg-cover bg-[url(/Background.png)]">
          <main className="w-full bg-gray-400/40">
              <div className="py-10 mx-auto flex w-full h-full">
                  <Outlet />
              </div>
          </main>
        </div>
    </div>
  )
}

export default WorkerWebsite;