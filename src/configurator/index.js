import Configurator from "components/Configurator";
import ConfiguratorButton from "components/ConfiguratorButton";
import { useMaterialUIController } from "context";
import { setOpenConfigurator } from "context";
import { useUser } from "context/userContext";
import { useContext, useEffect, useRef, useState } from "react";

import AddTransaction from "layouts/billing/addTransaction";
import RequestInvestmentForm from "layouts/revenues/requestInvestment"
import AddWalletTransaction from 'layouts/transactions/addTransaction'
import AddTicket from 'layouts/tickets/addTicket'
import AddPackage from 'layouts/packages/addPackage'
import AddClient from 'layouts/clients/addClient'; // Updated path
import AddAdmin from 'layouts/admins/addAdmin'; // Reemplaza con el componente adecuado


import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { Icon } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import 'index.css'
import { faChartLine, faCircleDollarToSlot, faCircleQuestion, faMoneyBillTransfer, faReceipt, faTicket } from "@fortawesome/free-solid-svg-icons";
import { TransitionButton } from "./transitionButton";
import ConfiguratorContext from "./configuratorContext";
import squares from 'assets/icon/squares.png'

export function ConfiguratorManager() {
  const { customContent, setCustomContent, customTitle, setCustomTitle, customDescription, setCustomDescription } = useContext(ConfiguratorContext);
  // Global configurations for the sidebar
  const [controller, dispatch] = useMaterialUIController();
  const { openConfigurator } = controller;

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // User context
  const { user } = useUser();

  // Handlers
  const handleAddTransactionClick = () => {
    handleConfiguratorOpen();
    setCustomContent(<AddTransaction />);
    setCustomTitle("Solicitar ingreso/retiro")
    setCustomDescription("Ingresa la información de transacción")
  };

  const handleAddInvestmentClick = () => {
    handleConfiguratorOpen();
    setCustomContent(
      <RequestInvestmentForm   />
    );
    setCustomTitle("Solicitar inversión")
    setCustomDescription("Ingresa la información del inversión")
  };

  const handleAddTransferClick = () => {
    handleConfiguratorOpen()
    setCustomContent(
      <AddWalletTransaction />
    )
    setCustomTitle("Realizar transacción")
    setCustomDescription("Ingresa la información del transacción")
  }

  const handleAddTicketClick = () => {
    handleConfiguratorOpen()
    setCustomContent(
      <AddTicket />
    )
    setCustomTitle("Redactar ticket de soporte")
    setCustomDescription("Ingresa la información del ticket")
  }

  const handleAddPackageClick = () => {
    handleConfiguratorOpen()
    setCustomContent(<AddPackage />)
    setCustomTitle("Añadir Paquete")
    setCustomDescription("Ingresa la información del paquete")
  }

  const handleAddClientClick = () => {
    handleConfiguratorOpen()
    setCustomContent(
      <AddClient />
      )
      setCustomTitle("Añadir cliente")
      setCustomDescription("Ingresa la información del cliente")
    }

    const handleAddAdminClick = () => {
      handleConfiguratorOpen();
      setCustomContent(
        <AddAdmin /> // Reemplaza con el componente adecuado
      );
      setCustomTitle("Añadir administrador")
      setCustomDescription("Ingresa la información del administrador")
    };

  // TOGGLE 

  const [isButtonsVisible, setButtonsVisible] = useState(false);
  const toggleButtons = () => {
    setButtonsVisible(!isButtonsVisible);
  }

  const node = useRef();

  const handleClickOutside = e => {
    if (!node.current.contains(e.target)) {
      setButtonsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
  <MDBox>
    {user && (
      <MDBox
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={100}
      >
        <MDButton 
          variant="gradient" 
          circular={true}
          iconOnly={true}
          size="large" 
          color="info" 
          onClick={toggleButtons}
        >
          {isButtonsVisible ? (
            <Icon fontSize="large">close</Icon>
          ) : (
            <MDBox m={0} src={squares} style={{padding:"0px"}} component="img" width="2rem" height="2rem" />
          )}
          
        </MDButton>
      </MDBox>  
    )}
      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      
    <MDBox ref={node}>
        {user?.__t == "Client" &&
          <>
            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faCircleDollarToSlot} isFontAwesome   pos={7.5} f={handleAddTransactionClick} vl="Realizar depósito/retiro"/>
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faChartLine} isFontAwesome pos={4.5} f={handleAddInvestmentClick} vl="Realizar Inversión" />
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faMoneyBillTransfer} isFontAwesome pos={6} f={handleAddTransferClick} vl="Transferir entre billeteras" />
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faCircleQuestion} isFontAwesome pos={3} f={handleAddTicketClick} vl="Obtén ayuda" />
            </TransitionButton>
          </>
        }
        { ((user?.__t == "Admin") || (user && !user.__t)) &&
          <>
            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon="add" pos={3} f={handleAddPackageClick} vl="Añadir paquete" />
            </TransitionButton>
            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon="add" pos={4.5} f={handleAddClientClick} vl="Añadir cliente" />
            </TransitionButton>
          </>
        }
        { (user && !user.__t) && (
          <TransitionButton visible={isButtonsVisible}>
            <ConfiguratorButton icon="add" pos={6} f={handleAddAdminClick} vl="Añadir administrador" />
          </TransitionButton>
        ) }
      </MDBox>
  </MDBox>
  )
}
