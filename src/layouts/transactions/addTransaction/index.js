import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";
import { useParams } from "react-router-dom";
import { useUser } from "context/userContext";
import MDTypography from "components/MDTypography";
import { setOpenConfigurator, useMaterialUIController } from "context";

const WalletTransactionForm = () => {
    const {user, setUser} = useUser()

    const [transactionAmount, setTransactionAmount] = useState("");
    const [walletPassword, setWalletPassword] = useState("");
    const [transactionType, setTransactionType] = useState("usd"); // Default to "usd"

    const [controller, dispatch] = useMaterialUIController();
    const { showNotification } = useNotification();

    const handleWalletTransaction = async () => {
        try {
            const dest = transactionType;
            const response = await axiosInstance().post(`/movements/wallet-transactions/${user.username}/${dest}`, {
                transaction_amount: transactionAmount,
                wallet_password: walletPassword,
            });
            setOpenConfigurator(dispatch, false)
            showNotification("success", "Transacción realizada correctamente", `ID de la transacción: ${response.data._id}`);
        } catch (error) {
            console.error('Error in wallet transaction:', error.response.data.error);
            showNotification("error", "Error en la transacción de la billetera", error.response.data.error);
        }
    };

    return (
        <MDBox component="form" role="form">
            <MDBox mb={2}>
                <MDBox margin={2}>
                    <MDTypography variant="caption" display="block">
                        {`Disponible Billetera USD: $${user.usd_wallet.available_amount}`}
                    </MDTypography>
                    <MDTypography variant="caption" display="block">
                        {`Disponible Billetera de Inversiones: $${user.i_wallet.available_amount}`}
                    </MDTypography>
                </MDBox>
                <MDInput
                    type="number"
                    label="Monto de transacción"
                    fullWidth
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                />
            </MDBox>

            <MDBox mb={2}>
                <FormControl fullWidth>
                    <InputLabel id="transaction-type">Destino</InputLabel>
                    <Select
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        label="Tipo de Transacción"
                        labelId="transaction-type"
                        sx={{ paddingY: '8px' }}
                        fullWidth
                    >
                        <MenuItem value="inv">Billetera de Inversiones</MenuItem>
                        <MenuItem value="usd">Billetera USD</MenuItem>
                    </Select>
                </FormControl>
            </MDBox>

            <MDBox mb={2}>
                <MDInput
                    type="password"
                    label="Wallet Password"
                    fullWidth
                    value={walletPassword}
                    onChange={(e) => setWalletPassword(e.target.value)}
                />
            </MDBox>

            <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={handleWalletTransaction}>
                    Realizar Transacción
                </MDButton>
            </MDBox>
        </MDBox>
    );
};

export default WalletTransactionForm;
