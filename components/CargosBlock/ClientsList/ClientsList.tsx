import React, { useState, Fragment, useMemo } from 'react'
import { observer } from "mobx-react-lite"

// mui
import { Divider, Grid, Typography } from '@mui/material'

// project components
import { ClientsListItem } from './ClientsListItem'
import EditClientModal from './EditClientModal'
import { ScrollableBlock } from "@/components/ui-component/ScrollableBlock"

// utils
import { GRID_SPACING } from '@/lib/const'

// store
import { UserOfDB } from '@/stores/userStore'
import ClientsStore from "@/stores/clientsStore"
import CargosStore from "@/stores/cargosStore"

export interface ClientsListProps {
  isLoading: boolean
  title?: string
  showConfirmToLeave?: Function
}

export type openEditModalHandlerArgs = {
  clientId: string
}

export const ClientsList = observer(({
                                       isLoading,
                                       title="Список клиентов",
                                       showConfirmToLeave,
                     }: ClientsListProps) => {
  const clients = useMemo(
    () => [...ClientsStore.clients.items],
    [JSON.stringify(ClientsStore.clients.items)]
  )
  const [selectedClient, setSelectedClient] = useState<UserOfDB | null>(null)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)

  const openEditModalHandler = ({ clientId }: openEditModalHandlerArgs): void => {
    //  open modal
    const chosenCustomer = clients.find((client) => client.id === clientId)
    if (chosenCustomer) setSelectedClient(chosenCustomer)
    setIsOpenEditModal(true)
  }

  const handleCloseModal = (): void => {
    setIsOpenEditModal(false)
  }

  const selectCurrentClientHandler = (client: UserOfDB) => {
    const areFilesLoading = Boolean(CargosStore.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded)
    if (areFilesLoading && showConfirmToLeave) {
      showConfirmToLeave(
        setNewCurrentItem.bind(this, client),
        () => { /* cancel... */ }
      )

      return
    }

    setNewCurrentItem(client)

    //  set cargos list && set filtering cargos list by "currents"
    if (client.userCodeId) {
      const isArchive = false
      CargosStore.setCurrentItemsListByStatus({
        isArchive,
        currentUserCode: client.userCodeId
      })
    } else {
      console.info('Warning: User doesn\'t have userCodeId')
      CargosStore.clearCurrentItemsList()
      CargosStore.clearCurrentItem()

      return
    }

    // set current cargo item
    const firstCargoInList = CargosStore.cargos.currentItemsList?.[0]
    if (firstCargoInList) {
      CargosStore.setCurrentItem({...firstCargoInList})
    } else {
      console.info('Warning: User doesn\'t have cargos. CargosStore.cargos.currentItemsList?.[0] not found')
      CargosStore.clearCurrentItem()
    }
  }

  const setNewCurrentItem = (client: UserOfDB) => {
    ClientsStore.setCurrentItem({...client})
  }

  return (
    <>
      <ScrollableBlock
        isLoading={isLoading}
        isScrollable
        underContent={
          <EditClientModal
            client={selectedClient}
            isVisible={isOpenEditModal}
            handleCancel={handleCloseModal}
          />
        }
      >
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12}>
            <Grid container alignContent="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4">{title}</Typography>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {
              !Array.isArray(clients) || clients?.length === 0
                ? <>
                  <p>Нет клиентов</p>
                </>
                : <>
                  {clients.map((client, index) => {
                    const isLastEl = Boolean((clients.length - 1) === index)

                    return (
                      <Fragment key={client.id}>
                        <ClientsListItem
                          item={client}
                          openEditModalHandler={openEditModalHandler}
                          selectCurrentClientHandler={selectCurrentClientHandler}
                        />
                        {!isLastEl && <Divider sx={{ my: 1.5 }} />}
                      </Fragment>
                    )
                  })}
                </>
            }
          </Grid>
        </Grid>
      </ScrollableBlock>
    </>
  )
})

export default ClientsList
