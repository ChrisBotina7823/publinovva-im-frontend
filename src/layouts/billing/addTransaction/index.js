import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { setOpenConfigurator, useMaterialUIController } from "context";
import { useUser } from "context/userContext";
import { Card, CircularProgress, Grid, Modal } from "@mui/material";
import MDTypography from "components/MDTypography";
import { formatCurrency } from "utils";
import MasterCard from "examples/Cards/MasterCard";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";

const DepositWithdrawForm = () => {
  const [transactionType, setTransactionType] = useState("deposit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [usdPassword, setUsdPassword] = useState("");
  const [showUsdPassword, setShowUsdPassword] = useState(false);
  const { user } = useUser()
  const [modalOpen, setModalOpen] = useState(false)

  const { showNotification } = useNotification();
  const [controller, dispatch] = useMaterialUIController();
  const [ depositAddress, setDepositAddress ] = useState("usdt")

  const [loading, setLoading] = useState()

  const cards = {
    "usdt": (
      <MasterCard
        color="success"
        logo={user.admin.usdt_qr}
        number={user.admin.usdt_address || "---"}
        title="Dirección USDT (trc20)"
        holder={user.admin.entity_name}
        icon="tether"
        isCustom
      />
    ),
    "btc": (
      <MasterCard
        color="warning"
        logo={user.admin.btc_qr}
        number={user.admin.btc_address || "---"}
        title="Dirección Bitcoin"
        holder={user.admin.entity_name}
        link={user.admin.btc_link}
        icon={faBitcoin}
        isFontAwesome
      />
    ),
    "ethereum": (
      <MasterCard
        color="info"
        logo={user.admin.ethereum_qr}
        number={user.admin.ethereum_address || "---"}
        title="Dirección Ethereum"
        holder={user.admin.entity_name}
        link={user.admin.ethereum_link}
        icon={faEthereum}
        isFontAwesome
      />
    )
  }
  const addressesNames = {
    "usdt": "Billetera USDT (trc20)",
    "btc": "Billetera Bitcoin",
    "ethereum": "Billetera Ethereum"
  }

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setShowUsdPassword(false); // Reset to hide USD password field when changing transaction type
  };


  const handleTransaction = async () => {
    try {
      setLoading(true)

      const endpoint =
        transactionType === "deposit"
          ? `movements/make-deposit/${user._id}`
          : `movements/make-withdrawal/${user._id}`;

      const requestBody = {
        transaction_amount: transactionAmount,
      };

      if (transactionType === "withdrawal") {
        requestBody.wallet_password = usdPassword;
      }

      const response = await axiosInstance().post(endpoint, requestBody);

      if(transactionType == "deposit") {
        setDepositAddress(depositAddress)
        setModalOpen(true)
      }

      setOpenConfigurator(dispatch, false);
      if(transactionType === "deposit") {
        showNotification(
          "success",
          `Solicitud de depósito exitosa`,
          `Para continuar con el proceso, realiza la transferencia a la cuenta del administrador`
        );        
      } else {
        showNotification(
          "success",
          `Solicitud de retiro exitosa`,
          `Se le notificará a tu administrador para que tu solicitud sea procesada`
        );    
      }
    } catch (error) {
      console.error(`Error during ${transactionType} transaction:`, error.response.data.error);
      showNotification("error", `Error durante ${transactionType} transacción`, error.response.data.error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <MDBox
      component="form"
      role="form"
      textAlign={loading ? "center" : "left"}
    >
      {loading ? (
        <CircularProgress color="secondary" size={60} />
      ) : (
        <>
          <Modal
            open={modalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Grid 
                container
                alignItems={"center"}
                justifyContent={"center"}
                md={8}
                xs={10}
                marginX="auto"
                marginY={8}
                >
              <Grid item xs={12}>
                <Card>
                  <MDBox paddingY={4} paddingX={4} mx={3}>
                    <MDTypography textAlign="center" variant="h5">Solicitud de Depósito realizada con éxito</MDTypography>
                    <MDTypography marginBottom={2} variant="body2">Por favor, realiza la transferencia a la cuenta del administrador</MDTypography>
                    {cards[depositAddress]}
                    <MDBox display="flex" paddingY={2} justifyContent="center" >
                      <MDButton marginTop={2} marginX="auto" variant="gradient" color="info" onClick={() => setModalOpen(false)}>Aceptar</MDButton>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </Modal>
          <MDBox mb={2}>
            <FormControl fullWidth>
              <InputLabel id="transaction-type">Tipo de Transacción</InputLabel>
              <Select
                value={transactionType}
                onChange={handleTransactionTypeChange}
                label="Tipo de Transacción"
                labelId="transaction-type"
                sx={{ paddingY: "8px" }}
                fullWidth
              >
                <MenuItem value="deposit">Depósito</MenuItem>
                <MenuItem value="withdrawal">Retiro</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="number"
              label="Monto de Transacción"
              fullWidth
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            {transactionType === "withdrawal" && 
              <MDBox>
              <MDTypography variant="caption" display="block" size={12}>Se te cobrará una comisión de 5% del monto de retiro</MDTypography>
              <MDTypography variant="body2" id="receivedAmount">Se te entregará: {formatCurrency(transactionAmount * 0.95)}</MDTypography>
              </MDBox>
            }
          </MDBox>
          {transactionType === "withdrawal" && (
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña USD"
                fullWidth
                value={usdPassword}
                onChange={(e) => setUsdPassword(e.target.value)}
              />
            </MDBox>
          )}
          {transactionType === "deposit" && (
            <FormControl fullWidth>
              <InputLabel id="deposit-address">Billetera de Depósito del Administrador</InputLabel>
              <Select
                value={depositAddress}
                onChange={e => setDepositAddress(e.target.value)}
                label="Billetera de Depósito del Administrador"
                labelId="transaction-type"
                sx={{ paddingY: "8px" }}
                fullWidth
              >
                <MenuItem value="usdt">Billetera USDT (trc20)</MenuItem>
                <MenuItem value="btc">Billetera Bitcoin (btc)</MenuItem>
                <MenuItem value="ethereum">Billetera Ethereum (eth)</MenuItem>
              </Select>
            </FormControl>
          )}
          <MDBox mt={4} mb={1}>
            {user?.__t == "Client" &&
              <MDButton variant="gradient" color="info" fullWidth onClick={handleTransaction}>
                {transactionType === "deposit" ? "Realizar Depósito" : "Realizar Retiro"}
              </MDButton>
            }
          </MDBox>
        </>
      )}
    </MDBox>

  );
};

export default DepositWithdrawForm;
