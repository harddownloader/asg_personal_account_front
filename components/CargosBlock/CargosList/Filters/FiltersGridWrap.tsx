import { Filters, FiltersProps } from "@/components/CargosBlock/CargosList/Filters"
import { Grid } from "@mui/material"

export const FiltersGridWrap = ({ isShowFilters }: FiltersProps) => {
  const gridStyles = !isShowFilters ? {
    '&.MuiGrid-item': {
      padding: 0
    }
  } : null

  return (
    <>
      <Grid
        item
        xs={12}
        sx={gridStyles}
      >
        <Filters isShowFilters={isShowFilters} />
      </Grid>
    </>
  )
}

export default FiltersGridWrap
