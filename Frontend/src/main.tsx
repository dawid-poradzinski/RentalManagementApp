import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
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
import WorkerAddMaintenance from './worker/pages/maintenances/WorkerAddMaintenance.tsx';
import AuthWebsite from './auth/AuthWebsite.tsx';
import AuthLogin from './auth/AuthLogin.tsx';
import AuthRegister from './auth/AuthRegister.tsx';
import AuthProvider from './auth/AuthContext.tsx';
import ProtectedRoute from './auth/ProtectedRoute.tsx';
import WorkerGetRentals from './worker/pages/rentals/WorkerGetRentals.tsx';
import WorkerGetRental from './worker/pages/rentals/WorkerGetRental.tsx';
import WelcomeWebsite from './user/WelcomeWebsite.tsx';
import ItemRefresh from './user/ShopFlow/ItemRefresh.tsx';
import ShopProvider from './user/ShopContext.tsx';
import ItemCheck from './user/ShopFlow/ItemCheck.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: WelcomeWebsite
      },
      {
        path: "refresh",
        Component: ItemRefresh
      },
      {
        path: "check",
        Component: ItemCheck
      },
      {
        path: "auth",
        Component: AuthWebsite,
        children: [
          {
            index: true,
            path: "login",
            Component: AuthLogin
          },
          {
            path: "register",
            Component: AuthRegister
          }
        ]
      },
      {
        path: "worker",
        children: [
          {
            index: true,
            Component: () => (
              <ProtectedRoute ranks={["WORKER", "ADMIN"]}>
                <WorkerMainMenu />
              </ProtectedRoute>
            )
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
                Component: WorkerAddMaintenance
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
            path: "rentals",
            children: [
              {
                index: true,
                Component: WorkerRentalMenu,
              },
              {
                path: "find",
                Component: WorkerGetRentals
              },
              {
                path: ":id",
                Component: WorkerGetRental
              }
            ]
          }
        ]
      }
    ]
  }
])

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  </AuthProvider>
)