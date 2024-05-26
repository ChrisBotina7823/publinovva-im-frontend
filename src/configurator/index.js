import Configurator from "components/Configurator";
import ConfiguratorButton from "components/ConfiguratorButton";
import { useMaterialUIController } from "context";
import { setOpenConfigurator } from "context";
import { useUser } from "context/userContext";
import { useState } from "react";

import AddTransaction from "layouts/billing/addTransaction";
import RequestInvestmentForm from "layouts/revenues/requestInvestment"
import AddWalletTransaction from 'layouts/transactions/addTransaction'
import AddTicket from 'layouts/tickets/addTicket'
import AddPackage from 'layouts/packages/addPackage'
import AddClient from 'layouts/clients/addClient'; // Updated path


import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { Icon } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import 'index.css'
import { faChartLine, faMoneyBillTransfer, faReceipt, faTicket } from "@fortawesome/free-solid-svg-icons";
import { TransitionButton } from "./transitionButton";

export function ConfiguratorManager() {
  
  // Global configurations for the sidebar
  const [controller, dispatch] = useMaterialUIController();
  const { openConfigurator } = controller;
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);
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
    

  // TOGGLE 

  const [isButtonsVisible, setButtonsVisible] = useState(false);
  const toggleButtons = () => {
    setButtonsVisible(!isButtonsVisible);
  }


  return (
    <>
    {user && (
      <MDBox
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={100}
      >
        <MDButton variant="gradient" styles={{borderRadius:"100%"}} size="large" color="secondary" onClick={toggleButtons}><Icon>add</Icon></MDButton>
      </MDBox>      
    )}
      <Configurator customDescription={customDescription} customTitle={customTitle} customContent={customContent} />
      
    <>
        {user?.__t == "Client" &&
          <>
            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faReceipt} isFontAwesome   pos={3} f={handleAddTransactionClick} vl="Solicitar depósito/retiro"/>
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faChartLine} isFontAwesome pos={4.5} f={handleAddInvestmentClick} vl="Solicitar Inversión" />
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faMoneyBillTransfer} isFontAwesome pos={6} f={handleAddTransferClick} vl="Transferir entre billeteras" />
            </TransitionButton>

            <TransitionButton visible={isButtonsVisible}>
              <ConfiguratorButton icon={faTicket} isFontAwesome pos={7.5} f={handleAddTicketClick} vl="Redactar tiquete de soporte" />
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
      </>
    </>
  )
}
