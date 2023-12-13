import { Icon } from "@mui/material";
import MDBox from "components/MDBox";

export default ({ icon, f, pos }) => {
    const rightValue = `${pos * 2}rem`;
  
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right={rightValue}
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={f}
      >
        <Icon fontSize="small" color="inherit">
          {icon}
        </Icon>
      </MDBox>
    );
  };
  