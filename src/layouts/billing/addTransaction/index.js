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
import { CircularProgress } from "@mui/material";
import MDTypography from "components/MDTypography";
import { formatCurrency } from "utils";

const DepositWithdrawForm = () => {
  const [transactionType, setTransactionType] = useState("deposit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [usdPassword, setUsdPassword] = useState("");
  const [showUsdPassword, setShowUsdPassword] = useState(false);
  const { user } = useUser()

  const { showNotification } = useNotification();
  const [controller, dispatch] = useMaterialUIController();

  const [loading, setLoading] = useState()

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
