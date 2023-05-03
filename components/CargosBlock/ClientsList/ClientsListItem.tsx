import React, { MouseEvent, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"

// mui
import {
  Grid,
  Tooltip,
  Typography,
  Collapse
} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'

// types
import type { openEditModalHandlerArgs } from '@/components/CargosBlock/ClientsList/ClientsList'

// store
import { UserOfDB } from '@/stores/userStore'
import ClientsStore from "@/stores/clientsStore"

export interface ClientsListItemProps {
  item: UserOfDB,
  openEditModalHandler: (args: openEditModalHandlerArgs) => void,
  selectCurrentClientHandler: (client: UserOfDB) => void,
}

export const ClientsListItem = observer(({
                                           item,
                                           openEditModalHandler,
                                           selectCurrentClientHandler,
}: ClientsListItemProps) => {
  const [isShown, setIsShown] = useState(false)
  const selectedClient = useMemo(
    () => ({...ClientsStore.clients.currentItem}),
    [JSON.stringify(ClientsStore.clients.currentItem)]
  )
  const isCurrentClientSelected = selectedClient?.id === item.id

  const clickHandler = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation()
    openEditModalHandler({ clientId: item.id })
  }

  return (
    <>
      <Grid
        container
        direction="column"
        onClick={(e) => selectCurrentClientHandler(item)}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        className={`${isCurrentClientSelected ? 'bg-brand text-white' : ''} transition-all cursor-pointer rounded p-3 hover:bg-brand hover:text-white`}
      >
        <Grid item className={"pb-2"}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography className={"font-bold"} variant="subtitle1" color="inherit">
                { item.name }
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle1" color="inherit">
                    { item?.userCodeId ? item.userCodeId : '-' }
                  </Typography>
                </Grid>
                <Grid item>
                  <Collapse in={isCurrentClientSelected} timeout={200}>
                    <div
                      className={'flex items-center justify-center w-8 h-8 p-1 rounded cursor-pointer ml-4 border border-brand bg-white text-brand hover:text-white hover:bg-brand'}
                      onClick={clickHandler}
                    >
                      <Tooltip title="Редактировать клиента">
                        <EditIcon
                          color="inherit"
                          className={'w-[1.5rem] h-[1.5rem]'}
                        />
                      </Tooltip>
                    </div>
                  </Collapse>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Collapse in={isCurrentClientSelected || isShown} timeout={200}>
          <div>
            <Grid item>
              <Typography variant="inherit" className={"text-sm"}>
                { item?.phone ? item.phone : '-' }
              </Typography>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="inherit" className={"text-sm"}>
                  { item?.email ? item.email : '-' }
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="inherit" className={"text-sm"}>
                  { item?.city ? item.city : '-' }
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Collapse>
      </Grid>
    </>
  )
})

export default ClientsListItem
