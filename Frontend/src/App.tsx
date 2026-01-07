import { IconArrowNarrowLeft, IconUser } from "@tabler/icons-react";
import { Link, Outlet, useNavigate } from "react-router-dom"

function App() {

  
  const navigate = useNavigate();
  
  return (
      <div className="flex flex-col min-h-screen h-full w-full font-[Ubuntu] text-neutral-800">
        <header className="sticky z-100 top-0 h-20 w-full bg-gray-800 shadow-xl backdrop-blur-lg text-white flex items-center justify-between px-4 text-3xl">
          <>
            <IconArrowNarrowLeft stroke={2} onClick={() => navigate(-1)} size={50} className="cursor-pointer"/>
            <Link to={"/worker"}>Menu</Link>
          </>
          <IconUser stroke={2} size={30} className="cursor-pointer hover:bg-slate-300/20 rounded-xl"/>
        </header>
        <div className="flex-1 w-full flex flex-row bg-cover bg-[url(/Background.png)]">
          <main className="w-full bg-gray-400/40">
              <div className="py-6 mx-auto flex w-full h-full">
                  <Outlet />
              </div>
          </main>
        </div>
    </div>
  )
}

export default App
