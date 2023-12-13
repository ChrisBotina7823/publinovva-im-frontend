/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Packages from "layouts/packages/packagesTable";
import Clients from "layouts/clients/clientsTable";
import Investments from "layouts/investments/investmentsTable";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import PrivateRoute from "components/PrivateRoute";
import Logout from "layouts/authentication/logout";
import Transactions from "layouts/transactions/transactionsTable"
import Tickets from "layouts/tickets/ticketsTable"
import Admins from "layouts/admins/adminsTable"
import Revenues from "layouts/revenues/revenuesTable"

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <PrivateRoute element={<Dashboard />} />,
  },
  {
    type: "collapse",
    name: "Packages",
    key: "packages",
    icon: <Icon fontSize="small">packages</Icon>,
    route: "/packages",
    component: <PrivateRoute element={<Packages />} />,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <Icon fontSize="small">client</Icon>,
    route: "/clients",
    component: <PrivateRoute element={<Clients />} />,
  },
  {
    type: "collapse",
    name: "Admins",
    key: "admins",
    icon: <Icon fontSize="small">admin</Icon>,
    route: "/admins",
    component: <PrivateRoute element={<Admins />} />,
  },
  {
    type: "collapse",
    name: "Investments",
    key: "investments",
    icon: <Icon fontSize="small">investment</Icon>,
    route: "/investments",
    component: <PrivateRoute element={<Investments />} />,
  },
  {
    type: "collapse",
    name: "Revenues",
    key: "revenues",
    icon: <Icon fontSize="small">revenue</Icon>,
    route: "/revenues",
    component: <PrivateRoute element={<Revenues />} />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <PrivateRoute element={<Billing />} />,
  },
  {
    type: "collapse",
    name: "Transactions",
    key: "transactions",
    icon: <Icon fontSize="small">Transactions</Icon>,
    route: "/transactions",
    component: <PrivateRoute element={<Transactions />} />,
  },
  {
    type: "collapse",
    name: "Tickets",
    key: "tickets",
    icon: <Icon fontSize="small">Tickets</Icon>,
    route: "/tickets",
    component: <PrivateRoute element={<Tickets />} />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <PrivateRoute element={<Notifications />} />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <PrivateRoute element={<Profile />} />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    // Add your Logout component as the element
    component: <PrivateRoute element={<Logout />} />,
  },
];

export default routes;
