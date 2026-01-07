import { Outlet } from "react-router-dom"

function App() {
  
  return (
      <div className="bg-gray-800 w-screen h-screen font-[Ubuntu]">
        <Outlet />
      </div>
  )
}

export default App
