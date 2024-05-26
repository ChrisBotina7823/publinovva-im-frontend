import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default ({ icon, f, pos, vl, isFontAwesome }) => {
  const rightValue = `${pos * 2}rem`;

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="auto"
      height="2.5rem"
      bgColor="secondary"
      shadow="sm"
      borderRadius="12px" // Puedes ajustar el radio según tus preferencias
      position="fixed"
      right="2rem"
      bottom={rightValue}
      zIndex={99}
      color="dark"
      variant="gradient"
      sx={{ cursor: "pointer", paddingX: 2, display: "flex", alignItems: "center" }}
      onClick={f}
    >
      {isFontAwesome && <FontAwesomeIcon style={{marginRight:10}} fontSize="1rem" color="white" icon={icon} />}
      {!isFontAwesome && <Icon sz={{marginLeft:10, marginRight:10}} fontSize="1rem" style={{"color":"white"}} >{icon}</Icon>}
      <MDTypography variant="body2" color="white">{vl}</MDTypography>
    </MDBox>
  );
};
