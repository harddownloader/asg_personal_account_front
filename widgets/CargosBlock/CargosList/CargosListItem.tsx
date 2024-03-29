import { useMemo, useState } from "react"
import { observer } from "mobx-react-lite"

// mui
import { Grid, Typography } from "@mui/material"
import Collapse from '@mui/material/Collapse'

// store
import { CargosStore } from '@/entities/Cargo'
import type { ICargoFull } from '@/entities/Cargo'
import { STATUS_OPTIONS } from '@/entities/Cargo'

export interface CargosListItemProps {
  item: ICargoFull
  selectCurrentCargoHandler: (cargo: ICargoFull) => void
}

export const CargosListItem = observer(({
                                 item,
                                 selectCurrentCargoHandler,
                               }: CargosListItemProps) => {
  const [isShown, setIsShown] = useState(false)
  const selectedCargo = useMemo(
    () => ({...CargosStore.cargos.currentItem}),
    [JSON.stringify(CargosStore.cargos.currentItem)]
  )
  const isCurrentCargosSelected = selectedCargo?.id === item.id

  const statusObj = STATUS_OPTIONS.find((_status) => _status.value === Number(item.status))
  const status = statusObj ? statusObj.text : ''

  return (
    <>
      <Grid
        container
        direction="column"
        onClick={(e) => selectCurrentCargoHandler(item)}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        className={`${isCurrentCargosSelected ? 'bg-brand text-white' : ''} transition-all cursor-pointer rounded p-3 hover:bg-brand hover:text-white`}
      >
        <Grid item className={"pb-2"}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="subtitle1"
                color="inherit"
                className={"font-bold"}
              >
                { item.tone?.label }
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle1" color="inherit">
                    Стоимость: { item.cost }$
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle1" color="inherit">
              Статус: { status }
            </Typography>
          </Grid>
          <Grid item>
            <Collapse in={isShown || isCurrentCargosSelected}>
              <Typography variant="subtitle1" color="inherit">
                Кол-во мест: { item?.spaces?.length }
              </Typography>
            </Collapse>
          </Grid>
        </Grid>
         <Grid container alignItems="center" justifyContent="space-between">
            <Grid item></Grid>
            <Grid item>
              <Collapse in={isShown || isCurrentCargosSelected}>
                <Typography variant="subtitle1" color="inherit">
                  Кг: { item.weight }
                </Typography>
              </Collapse>
            </Grid>
        </Grid>
      </Grid>
    </>
  )
})

CargosListItem.displayName = 'CargosListItem'
