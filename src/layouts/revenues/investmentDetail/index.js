import { Card, Grid, Icon } from "@mui/material";
import axiosInstance from "axiosInstance";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNotification } from "components/NotificationContext";
import Transaction from "layouts/billing/components/Transaction";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils";

export default function InvestmentDetail({id}) {
    const { showNotification } = useNotification();
    
    const [ investment, setInvestment ] = useState(null)
    const [ stats, setStats ] = useState(null)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance().get(`/investments/${id}`)
                console.log(response.data)
                const investment = response.data.investment
                const stats = response.data.stats
                console.log(stats)
                console.log(investment)
                setInvestment(investment)
                setStats(stats)
            } catch(err) {
                console.log(err)
                showNotification("error", "Error al cargar la inversión. Intente nuevamente.")                
            }
        }
        fetchData()
    }, [])

    return (
    <>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card style={{"padding": 10}}>
                    <MDTypography align="center">Ingresos totales</MDTypography>
                    <MDTypography variant="h3" align="center">{formatCurrency(stats?.total_revenue || 0)}</MDTypography>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    { stats?.revenues.map((revenue) => {
                        return (
                            <Transaction
                            color="success"
                            icon="expand_less"
                            name={investment.package.name}
                            description={new Date(revenue.date).toLocaleDateString('en-GB')}
                            value={`+ ${formatCurrency(revenue.amount)}`}
                          />
                        )
                    })}
                </Card>

            </Grid> 
        </Grid>

    </> 
    )
}