import { Card, CircularProgress, Grid, Icon } from "@mui/material";
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
    
    const [ loading, setLoading ] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance().get(`/investments/${id}`)
                // console.log(response.data)
                const investment = response.data.investment
                const stats = response.data.stats
                // console.log(stats)
                // console.log(investment)
                setInvestment(investment)
                setStats(stats)
            } catch(err) {
                // console.log(err)
                showNotification("error", "Error al cargar la inversión. Intente nuevamente.")                
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    return (
    <MDBox textAlign={loading ? "center" : "left"}>
        {loading ? (
            <CircularProgress m="auto" color="secondary" size={60} />
        ) : (
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
                            description={
                                new Date(revenue.date).toLocaleString('en-GB', {
                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit'
                                })
                            }
                            value={`+ ${formatCurrency(revenue.amount)}`}
                          />
                        )
                    })}
                </Card>

            </Grid> 
        </Grid>
        )}

    </MDBox> 
    )
}