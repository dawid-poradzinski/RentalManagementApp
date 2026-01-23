import { IconArrowNarrowLeft, IconShoppingBag, IconUser } from "@tabler/icons-react";
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "./auth/AuthContext";
import LoggedBurger from "./auth/LoggedBurger";
import { useContext } from "react";
import { ShopContext } from "./user/ShopContext";

function App() {

  const navigate = useNavigate();
  const {user} = useAuth()
  const {koszyk} = useContext(ShopContext)
  
  return (
      <div className="flex flex-col min-h-screen h-full w-full font-[Ubuntu] text-neutral-800">
        <header className="sticky z-100 top-0 h-20 w-full bg-gray-800 text-white flex items-center justify-between px-4 text-3xl">
          <div className="flex gap-2 items-center">
            <IconArrowNarrowLeft stroke={2} onClick={() => navigate(-1)} size={50} className="cursor-pointer"/>
            <Link to={"/"}>Ski Now World</Link>
          </div>

          <div className="flex gap-4">
            <Link to="/check" className="px-4 py-2 bg-gray-700 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-300/20 relative">
              <IconShoppingBag />
              <div className="absolute bg-red-700 px-4 text-sm rounded-xl left-1/2 bottom-[-50%] translate-x-[-50%] translate-y-[-50%]">
                {koszyk.length}
              </div>
            </Link>
            {!user ? (
              <Link to={"/auth/login"} className="px-2 py-2 bg-gray-700 rounded flex items-center gap-2 cursor-pointer hover:bg-slate-300/20">
                <IconUser stroke={2} size={30} />
                <div className="text-sm">
                Zaloguj się
                </div>
              </Link>
            ) : (
                <LoggedBurger />
            )}
          </div>

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
