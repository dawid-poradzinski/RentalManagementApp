import WorkerMenuCard from "../../addons/WorkerMenuCard";


function WorkerMainMenu() {
    return (
        <div className=" w-full h-full p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <WorkerMenuCard key='items' name='items' singleLink='items' />
                <WorkerMenuCard key='maintenances' name='maintenances' singleLink='maintenances' />
                <WorkerMenuCard key='rentals' name='rentals' singleLink='rentals' />
            </div>
        </div>
    )
}

export default WorkerMainMenu;