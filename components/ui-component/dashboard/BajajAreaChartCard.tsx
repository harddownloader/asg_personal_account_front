// @ts-nocheck
import { useEffect } from 'react'
import dynamic from "next/dynamic"

// mui
import { useTheme } from '@mui/material/styles'
import { Card, Grid, Typography } from '@mui/material'

// third-party
const ApexCharts = dynamic(() => import("apexcharts") as any, { ssr: false })
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

// project components
import chartData from './chart-data/bajaj-area-chart'

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
    const theme = useTheme()
    const navType = undefined

    const orangeDark = theme.palette.secondary[800]

    useEffect(() => {
      if (typeof ApexCharts?.exec === "function") {
        const newSupportChart = {
          ...chartData.options,
          colors: [orangeDark],
          tooltip: {
            theme: 'light'
          }
        }
        ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart)
      }

    }, [navType, orangeDark, ApexCharts])

    return (
        <Card sx={{ bgcolor: 'secondary.light' }}>
            <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                                Bajaj Finery
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
                                $1839.00
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[800] }}>
                        10% Profit
                    </Typography>
                </Grid>
            </Grid>
          {Chart && <Chart {...chartData} />}
        </Card>
    )
}

export default BajajAreaChartCard
