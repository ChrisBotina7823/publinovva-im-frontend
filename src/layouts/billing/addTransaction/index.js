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

const DepositWithdrawForm = () => {
  const [transactionType, setTransactionType] = useState("deposit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [usdPassword, setUsdPassword] = useState("");
  const [showUsdPassword, setShowUsdPassword] = useState(false);
  const {user} = useUser()

  const { showNotification } = useNotification();
  const [controller, dispatch] = useMaterialUIController();

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setShowUsdPassword(false); // Reset to hide USD password field when changing transaction type
  };

  const handleTransaction = async () => {
    try {

      const endpoint =
        transactionType === "deposit"
          ? `movements/make-deposit/${user.username}`
          : `movements/make-withdrawal/${user.username}`;

      const requestBody = {
        transaction_amount: transactionAmount,
      };

      if (transactionType === "withdrawal") {
        requestBody.wallet_password = usdPassword;
      }

      const response = await axiosInstance().post(endpoint, requestBody);

      setOpenConfigurator(dispatch, false);
      showNotification(
        "success",
        `${transactionType === "deposit" ? "Depósito" : "Retiro"} exitoso`,
        `Se ha realizado con éxito. ID de transacción: ${response.data._id}`
      );
    } catch (error) {
      console.error(`Error during ${transactionType} transaction:`, error.response.data.error);
      showNotification("error", `Error durante ${transactionType} transacción`, error.response.data.error);
    }
  };

  return (
    <MDBox component="form" role="form">
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
      </MDBox>
      {transactionType === "withdrawal"  && (
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
        <MDButton variant="gradient" color="info" fullWidth onClick={handleTransaction}>
          {transactionType === "deposit" ? "Realizar Depósito" : "Realizar Retiro"}
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default DepositWithdrawForm;
