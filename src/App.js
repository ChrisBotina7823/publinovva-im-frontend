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

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, unstable_HistoryRouter, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import { ConfirmProvider } from "material-ui-confirm";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import ConfigsButton from 'components/ConfiguratorButton'
import { IconContext } from "react-icons";
// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";


import Notification from 'components/Notification';
import socket from "socketInstance";
import axiosInstance from "axiosInstance";

import axios from "axios";
import { useUser } from "context/userContext";
import { useNotification } from "components/NotificationContext";
import PrivateRoute from "components/PrivateRoute";
import ConfiguratorButton from "components/ConfiguratorButton";
import Configurator from "components/Configurator";
import AddTransaction from "layouts/billing/addTransaction";
import { ConfiguratorManager } from "configurator";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();




  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    setOpenConfigurator(dispatch, false)
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

    const { user, updateUser } = useUser()

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <IconContext.Provider value={{ color: "blue", className: "global-class-name" }}>
        <ConfirmProvider defaultOptions={{ confirmationButtonProps: { autoFocus: true }, confirmationText: "Aceptar", cancellationText: "Cancelar" }}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={ user?.__t == "Client" ? user.admin.profile_picture : brandWhite}
                  brandName={user?.__t == "Client" ? user.admin.entity_name : "Investment Manager" } 
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
              </>
            )}
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<PrivateRoute element={<Navigate to="/dashboard" />} ></PrivateRoute> } />
            </Routes>
            <Notification />
            <ConfiguratorManager/>

        </ConfirmProvider>
      </IconContext.Provider>;
    </ThemeProvider>
  );
}
