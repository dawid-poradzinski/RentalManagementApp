import { Outlet } from "react-router-dom"

function App() {
  
  return (
      <div className="min-h-screen h-full w-full font-[Ubuntu] text-neutral-800">
        <Outlet />
      </div>
  )
}

export default App
