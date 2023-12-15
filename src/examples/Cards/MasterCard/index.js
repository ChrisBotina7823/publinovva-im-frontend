/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import pattern from "assets/images/illustrations/pattern-tree.svg";
import masterCardLogo from "assets/images/logos/mastercard.png";
import copy from 'clipboard-copy';
import { useNotification } from "components/NotificationContext";

function MasterCard({ color, number, holder, expires, logo }) {
  const { showNotification } = useNotification()

  const handleDepositCopy = async () => {
    await copy(number)
    showNotification("success", "Dirección copiada al portapapeles", `La dirección de depósito ${number} se ha copiado en el portapapeles`)
  }

  const numbers = [...`${number}`];

  // if (numbers.length < 16 || numbers.length > 16) {
  //   throw new Error(
  //     "Invalid value for the prop number, the value for the number prop shouldn't be greater than or less than 16 digits"
  //   );
  // }

  const num1 = numbers.slice(0, 4).join("");
  const num2 = numbers.slice(4, 8).join("");
  const num3 = numbers.slice(8, 12).join("");
  const num4 = numbers.slice(12, 16).join("");

  return (
    <Card
      sx={({ palette: { gradients }, functions: { linearGradient }, boxShadows: { xl } }) => ({
        background: gradients[color]
          ? linearGradient(gradients[color].main, gradients[color].state)
          : linearGradient(gradients.dark.main, gradients.dark.state),
        boxShadow: xl,
        position: "relative",
      })}
    >
      <MDBox
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0.2}
        sx={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
        }}
      />
      <MDBox position="relative" zIndex={2} p={2}>
        <MDBox color="white" p={1} lineHeight={0} display="inline-block">
          <Icon fontSize="default">wifi</Icon>
        </MDBox>
        <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>Dirección de Depósito</MDTypography>
        <MDTypography style={{cursor:"pointer"}} onClick={ handleDepositCopy } variant="h5" color="white" fontWeight="medium" sx={{ mt: 3, mb: 5, pb: 1 }}>
          {number}
          {/* {num1}&nbsp;&nbsp;&nbsp;{num2}&nbsp;&nbsp;&nbsp;{num3}&nbsp;&nbsp;&nbsp;{num4} */}
          <Icon fontSize="default" >copy</Icon>
        </MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" alignItems="center">
            <MDBox mr={3} lineHeight={1}>
              <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                Entidad
              </MDTypography>
              <MDTypography
                variant="h6"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {holder}
              </MDTypography>
            </MDBox>
            <MDBox lineHeight={1}>
              {/* <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                Expires
              </MDTypography>
              <MDTypography variant="h6" color="white" fontWeight="medium">
                {expires}
              </MDTypography> */}
            </MDBox>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" width="20%">
            { logo && <MDBox component="img" src={logo} alt="master card" width="100%" mt={1} borderRadius={"5px"}  />}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of MasterCard
MasterCard.defaultProps = {
  color: "dark",
};

// Typechecking props for the MasterCard
MasterCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  number: PropTypes.string.isRequired,
  holder: PropTypes.string.isRequired,
  expires: PropTypes.string.isRequired,
};

export default MasterCard;
