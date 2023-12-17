import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { FormControlLabel, Switch, TextField } from "@mui/material";
import axiosInstance from "axiosInstance";
import { useNotification } from "components/NotificationContext";

const TransactionActionForm = ({ dataItem }) => {
  const [approveToggle, setApproveToggle] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
    const { showNotification } = useNotification()

  const handleTransactionAction = async () => {
    try {
        console.log(dataItem._id)
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
    }
  };

  return (
    <MDBox component="form" role="form">
      {/* Toggle para aprobar o rechazar */}
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

      {/* Campo de monto de transacción si el toggle está activo */}
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

      {/* Botón para realizar la acción */}
      <MDBox mb={1}>
        <MDButton variant="gradient" color="info" fullWidth onClick={handleTransactionAction}>
          Realizar Acción
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default TransactionActionForm;
