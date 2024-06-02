import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"
import copy from 'clipboard-copy'
import { useNotification } from "components/NotificationContext"
import { CopyAllRounded } from "@mui/icons-material"

export default ({vl, variant, children, showIcon=false}) => {
    const { showNotification } = useNotification()

    let style
    if(variant == "thin") {
        style = { fontFamily: 'Bebas Neue, sans-serif', fontWeight: 'bold' }
    }

    const handleCopy = async () => {
        try {
            await copy(vl)
            showNotification("success", "Valor Copiado", `El valor ${vl} ha sido copiado al portapapeles`)        
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <MDBox>
            <MDTypography style={style} variant={variant} sx={{cursor:"pointer"}} onClick={() => handleCopy()}>{vl}{children}{showIcon && <CopyAllRounded/>}</MDTypography>   
        </MDBox>
    )
}