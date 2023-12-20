import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default ({ icon, f, pos, vl }) => {
  const rightValue = `${pos * 2}rem`;

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="auto"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="12px" // Puedes ajustar el radio según tus preferencias
      position="fixed"
      right={rightValue}
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer", paddingX: 2, display: "flex", alignItems: "center" }}
      onClick={f}
    >
      <Icon fontSize="small" color="inherit" sx={{ marginRight: 1 }}>
        {icon}
      </Icon>
      <MDTypography variant="body2">{vl}</MDTypography>
    </MDBox>
  );
};
