import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import WorkerWebsite from './worker/pages/WorkerWebsite.tsx';
import WorkerAddItem from './worker/pages/items/WorkerAdditem.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WorkerItemMenu from './worker/pages/menus/WorkerItemMenu.tsx';
import WorkerMainMenu from './worker/pages/menus/WorkerMainMenu.tsx';
import WorkerMaintenanceMenu from './worker/pages/menus/WorkerMaintenanceMenu.tsx';
import WorkerRentalMenu from './worker/pages/menus/WorkerRentalMenu.tsx';
import WorkerGetItem from './worker/pages/items/WorkerGetItem.tsx';
import WorkerGetMaintenancesForitem from './worker/pages/maintenances/WorkerGetMaintenancesForitem.tsx';
import WorkerGetMaintenance from './worker/pages/maintenances/WorkerGetMaintenance.tsx';
import WorkerGetMaintenances from './worker/pages/maintenances/WorkerGetMaintenances.tsx';
import WorkerGetItems from './worker/pages/items/WorkerGetItems.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/menu"
      },
      {
        path: "/worker",
        Component: WorkerWebsite,
        children: [
          {
            path: "",
            Component: WorkerMainMenu
          },
          {
            path: "items",
            children: [
              {
                index: true,
                Component: WorkerItemMenu
              },
              {
                path: "add",
                Component: WorkerAddItem
              },
              {
                path: "find",
                Component: WorkerGetItems
              },
              {
                path: ":id",
                Component: WorkerGetItem,
              },
              {
                path: ":id/maintenances",
                Component: WorkerGetMaintenancesForitem,
              },
              {
                path: ":id/maintenances/add",
                Component: WorkerAddItem
              }
            ]
          },
          {
            path: "maintenances",
            children: [
              {
                index: true,
                Component: WorkerMaintenanceMenu
              },
              {
                path: ":id",
                Component: WorkerGetMaintenance
              },
              {
                path: "find",
                Component: WorkerGetMaintenances
              }
            ]
          },
          {
            path: "/worker/rentals",
            Component: WorkerRentalMenu
          }
        ]
      }
    ]
  }
])

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
)