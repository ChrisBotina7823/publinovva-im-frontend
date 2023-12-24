import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { CircularProgress, FormControlLabel, Switch, TextField } from "@mui/material";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

const TransactionActionForm = ({ dataItem }) => {
  const [approveToggle, setApproveToggle] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
  const { showNotification } = useNotification()

  const [loading, setLoading] = useState()

  const handleTransactionAction = async () => {
    try {
      setLoading(true)
      if (approveToggle) {
        // Enviar solicitud para aprobar la transacción
        const response = await axiosInstance().post(`/movements/approve-transaction/${dataItem._id}`, {
          received_amount: receivedAmount,
        });
        showNotification("success", "Transacción Aprobada", `La transacción fue aprobada correctamente. ID de transacción: ${response.data._id}`);
      } else {
        // Enviar solicitud para rechazar la transacción
        const response = await axiosInstance().post(`/movements/reject-transaction/${dataItem._id}`);
        showNotification("success", "Transacción Rechazada", `La transacción fue rechazada correctamente. ID de transacción: ${response.data._id}`);
      }

      // Puedes agregar lógica adicional según tus necesidades, como actualizar la interfaz de usuario, etc.
    } catch (error) {
      console.error('Error al procesar la transacción:', error.response.data.error);
      showNotification("error", "Error al Procesar la Transacción", error.response.data.error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <MDBox
      component="form"
      role="form"
      textAlign="center"
    >
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <>
          <MDBox mb={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={approveToggle}
                  onChange={() => setApproveToggle(!approveToggle)}
                  inputProps={{ 'aria-label': 'toggle-approve-reject' }}
                />
              }
              label="Aprobar Transacción"
            />
          </MDBox>

          {approveToggle && (
            <MDBox mb={2}>
              <TextField
                label="Monto recibido"
                type="number"
                fullWidth
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
              />
            </MDBox>
          )}

          <MDBox mb={1}>
            <MDButton variant="gradient" color="info" onClick={handleTransactionAction}>
              Realizar Acción
            </MDButton>
          </MDBox>
        </>
      )}
    </MDBox>

  );
};

export default TransactionActionForm;
