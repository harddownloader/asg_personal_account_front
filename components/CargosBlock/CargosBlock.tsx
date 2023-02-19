import React, {
  Fragment,
  ReactElement,
  useEffect,
  useState
} from 'react'
import { observer } from "mobx-react-lite"

// mui
import { Grid } from '@mui/material'

// project components
import { CargosInfo } from "@/components/CargosBlock/CargosInfo/CargoInfo"
import { CargosList } from "@/components/CargosBlock/CargosList/CargosList"
import { ClientsList } from "@/components/CargosBlock/ClientsList"

// utils
import { GRID_SPACING } from '@/lib/const'
import { fixMeInTheFuture } from '@/lib/types'

// store
import CargosStore from '@/stores/cargosStore'
import ClientsStore from "@/stores/clientsStore"
import UserStore, { UserIdType, UserOfDB } from "@/stores/userStore"

export interface CargosBlockProps {

}

export const CargosBlock = observer(({}: CargosBlockProps) => {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)

  }, [])
  const isManager = Boolean(UserStore.user.currentUser?.role === 1)
  // useEffect(() => {
  //   console.log({'ClientsStore.clients.items': [...ClientsStore.clients.items]})
  // }, [ClientsStore.clients.items.length])
  //
  // const clients = [...ClientsStore.clients.items]
  // console.log('CargosBlock', {clients})

  return (
    <>
      <Grid container spacing={GRID_SPACING}>
        <Grid item xs={12}>
          <Grid container spacing={GRID_SPACING}>
            {isManager && <Grid item lg={4} md={6} sm={6} xs={12}>
               <ClientsList
                isLoading={isLoading}
                title={"Список клиентов"}
              />
            </Grid>}
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <CargosList
                items={CargosStore.cargos.currentItemsList}
                isLoading={isLoading}
                title={"Список грузов"}
                isCurrentUserManager={isManager}
                isCurrentClientHasClientCode={Boolean(ClientsStore.clients.currentItem?.userCodeId)}
              />
            </Grid>
            <Grid item lg={isManager ? 4 : 8} md={6} sm={6} xs={12}>
              <CargosInfo
                title={"Информация о грузе"}
                isFull={!isManager}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
})

export default CargosBlock
