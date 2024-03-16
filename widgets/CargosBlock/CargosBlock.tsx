import {
  useEffect,
  FunctionComponent,
} from 'react'
import { observer } from "mobx-react-lite"
import * as Sentry from '@sentry/nextjs'

// mui
import { Grid } from '@mui/material'

// project components
import { CargosInfo } from "@/widgets/CargosBlock/CargosInfo/CargoInfo"
import { CargosList, CargosListProps } from "@/widgets/CargosBlock/CargosList/CargosList"
import { ClientsList } from "@/widgets/CargosBlock/ClientsList"
import { ConfirmToLeave } from "@/widgets/CargosBlock/ConfirmToLeave"
import { ClientsListProps } from "@/widgets/CargosBlock/ClientsList/ClientsList"

// shared
import { GRID_SPACING } from '@/shared/const'

// store
import { ClientsStore } from "@/entities/User"
import { UserStore } from "@/entities/User"
import { USER_ROLE } from '@/entities/User'
import type {
  IUserOfDB,
  TDecodedAccessToken,
} from '@/entities/User'
import {
  CargosStore,
  CargosListView,
  CargosListPooling
} from "@/entities/Cargo"

/*
* WHAT IS 'CargosBlock' DOING:
* 1. Init cargos for them visibility
* 2. Calculate layout (is it layout for admin/manager or client)
* 3. Wraps components in a hook that warns about file download interruptions, if any
* 4. Pooling new cargos
* */
export const CargosBlock = observer(() => {
  const currentClient: IUserOfDB | null = ClientsStore.clients?.currentItem
  const isUserEmployee = Boolean(UserStore.user.currentUser?.role > USER_ROLE.CLIENT)
  const isCurrentClientHasClientCode = Boolean(currentClient?.userCodeId)

  // @ts-ignore
  const ClientsListWithConfirm: FunctionComponent<ClientsListProps> = ConfirmToLeave(ClientsList)
  // @ts-ignore
  const CargosListWithConfirm: FunctionComponent<CargosListProps> = ConfirmToLeave(CargosList)

  // /* init cargos list */
  // useEffect(() => {
  //   initCargoList()
  // }, [])
  //
  // const initCargoList = () => {
  //   if (
  //     !isUserEmployee &&
  //     !isCurrentClientHasClientCode &&
  //     !CargosStore.cargos.currentItemsList.length
  //   ) {
  //     CargosListView.archiveItemsToggle(false)
  //   }
  // }

  /*
  * pooling new cargos, if were found, set them to store
  * */
  useEffect(() => {
    const TTL_DELAY_TO_START_POOLING_CARGOS_MS = 5000 as const
    const TTL_POOLING_CARGOS_MS = 60000 as const

    let intervalId: NodeJS.Timeout | null = null
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(async () => {
        await CargosListPooling.poolingNewCargosForUser(isUserEmployee)
      }, TTL_POOLING_CARGOS_MS)
    }, TTL_DELAY_TO_START_POOLING_CARGOS_MS)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  })

  useEffect(() => {
    if (
      !isUserEmployee &&
      isCurrentClientHasClientCode &&
      !CargosStore.cargos.currentItemsList.length
    ) {
      CargosListView.archiveItemsToggle(false)
    }
  }, [isCurrentClientHasClientCode])

  return (
    <>
      <Grid container spacing={GRID_SPACING}>
        <Grid item xs={12}>
          <Grid container spacing={GRID_SPACING}>
            {isUserEmployee && <Grid item lg={4} md={6} sm={6} xs={12}>
              <ClientsListWithConfirm
                isLoading={false}
                title={"Грузы по клиентом"}
              />
            </Grid>}
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <CargosListWithConfirm
                isLoading={false}
                title={"Список грузов"}
                isCurrentUserManager={isUserEmployee}
                isCurrentClientHasClientCode={isCurrentClientHasClientCode}
                currentClient={currentClient}
              />
            </Grid>
            <Grid item lg={isUserEmployee ? 4 : 8} md={6} sm={6} xs={12}>
              <CargosInfo
                title={"Информация о грузе"}
                isFull={!isUserEmployee}
                currentClient={currentClient}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
})

CargosBlock.displayName = 'CargosBlock'
