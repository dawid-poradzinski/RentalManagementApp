import { Outlet } from "react-router-dom";
import WorkerMenuCard from "../../addons/WorkerMenuCard";

function WorkerItemMenu() {
    return (
        <div className=" w-full h-full p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <WorkerMenuCard key='add' name='add' singleLink='add' />
                <WorkerMenuCard key='find' name='find' singleLink='find' />
            </div>
            <Outlet />
        </div>
    )
}

export default WorkerItemMenu;