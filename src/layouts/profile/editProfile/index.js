import MDBox from "components/MDBox";
import { useUser } from "context/userContext";
import EditAdminForm from "layouts/admins/editAdmin";
import EditClientForm from "layouts/clients/editClient";



export default function EditUserForm({id, f}) {
    const {user} = useUser()

    return (
        <MDBox>
            { user.__t == "Client" &&
                <EditClientForm id={id} f={f} />
            }
            {user.__t == "Admin" &&
                <EditAdminForm id={id} f={f} />
            }
        </MDBox>
    ) 
}