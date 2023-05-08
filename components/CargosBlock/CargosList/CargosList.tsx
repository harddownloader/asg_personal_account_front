import React, {
  useState,
  useMemo,
  useEffect,
  Fragment
} from "react"
import { observer } from "mobx-react-lite"

// mui
import AddIcon from '@mui/icons-material/Add'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import {
  Button,
  Divider,
  Grid,
  Tooltip,
  Typography
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// project components
import { CargosListItem } from '@/components/CargosBlock/CargosList/CargosListItem'
import { AddCargoDialog } from "@/components/CargosBlock/CargosList/AddCargoDialog/AddCargoDialog"
import { ScrollableBlock } from "@/components/ui-component/ScrollableBlock"
import { FiltersGridWrap } from "@/components/CargosBlock/CargosList/Filters"

// utils
import { GRID_SPACING } from "@/lib/const"

// store
import CargosStore, {
  ICargoFull
} from '@/stores/cargosStore'
import ClientsStore from "@/stores/clientsStore"

export interface CargosListProps {
  isLoading: boolean
  title?: string
  isCurrentUserManager: boolean
  isCurrentClientHasClientCode: boolean
  showConfirmToLeave?: Function
}

export const CargosList = observer(({
                                      isLoading,
                                      title="Список грузов",
                                      isCurrentUserManager,
                                      isCurrentClientHasClientCode,
                                      showConfirmToLeave,
                           }: CargosListProps) => {
  const theme = useTheme()

  const cargos: Array<ICargoFull> = useMemo(
    () => ([...CargosStore.cargos.currentItemsList]),
    [JSON.stringify([CargosStore.cargos.currentItemsList])]
  )
  const isArchive = CargosStore.cargos.isCurrentItemsListArchive
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false)

  useEffect(() => {
    if (
      isCurrentUserManager &&
      !isCurrentClientHasClientCode &&
      CargosStore.cargos.currentItemsList.length === 0
    ) {
      archiveItemsToggle(false)
    }
  }, [])

  useEffect(() => {
   if (
     !isCurrentUserManager &&
     isCurrentClientHasClientCode &&
     !CargosStore.cargos.currentItemsList.length
   ) {
     archiveItemsToggle(false)
   }
  }, [isCurrentClientHasClientCode])

  const archiveItemsToggle = (status: boolean): void => {
    CargosStore.setCurrentItemsListByStatus({
      isArchive: status,
      currentUserCode: ClientsStore.clients.currentItem?.userCodeId ? ClientsStore.clients.currentItem.userCodeId : undefined
    })
  }

  const handleClick = () => {
    //  open modal
    setIsOpenAddModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenAddModal(false)
  }

  const getToggleBtnClass = (isActive: boolean): string => {
    const dynamicClasses = isActive
      ? `bg-brand hover:bg-white border-white hover:border-brand text-white hover:text-brand`
      : `bg-white hover:bg-brand border-brand hover:border-white text-brand hover:text-white`
    const staticClasses = `border-solid border font-bold rounded h-14 mt-4`
    return `${dynamicClasses} ${staticClasses}`
  }

  const [currentCargosBtnClassNames, archiveCargosBtnClassNames] = useMemo((): Array<string> => {
    return [getToggleBtnClass(!isArchive), getToggleBtnClass(isArchive)]
  }, [isArchive])

  const selectCurrentCargoHandler = (cargo: ICargoFull) => {
    const areFilesLoading = Boolean(CargosStore.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded)
    if (areFilesLoading && showConfirmToLeave) {
      showConfirmToLeave(
        setNewCurrentItem.bind(this, cargo),
        () => { /* cancel... */ }
      )

      return
    }

    setNewCurrentItem(cargo)
  }

  const setNewCurrentItem = (cargo: ICargoFull) => {
    // if we are here from all cargos list(not by user)
    if (isCurrentUserManager && (
      !ClientsStore.clients.currentItem?.id ||
      cargo.clientCode !== ClientsStore.clients.currentItem.userCodeId
    )) {
      const clientOfCargo = ClientsStore.clients.items.find((client) => client.userCodeId === cargo.clientCode)
      if (clientOfCargo) ClientsStore.setCurrentItem({...clientOfCargo})
    }
    CargosStore.setCurrentItem({...cargo})
  }

  const isShowFilters = CargosStore.filtersOfList.isShowFilters
  const showFiltersHandler = () => {
    CargosStore.toggleShowingFilters(!isShowFilters)
  }

  return (
    <>
      <ScrollableBlock
        isLoading={isLoading}
        isScrollable
        underContent={
          <>
            {isOpenAddModal && <AddCargoDialog
              isVisible={isOpenAddModal}
              handleCancel={handleCloseModal}
              clientCode={ClientsStore.clients.currentItem?.userCodeId
                ? ClientsStore.clients.currentItem.userCodeId
                : null
              }
              clientId={ClientsStore.clients.currentItem?.id
                ? ClientsStore.clients.currentItem.id
                : null
              }
            />}
          </>
        }
        >
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12}>
            <Grid container alignContent="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4">{title}</Typography>
              </Grid>
              {isCurrentUserManager && <Grid item>
                <>
                  <Tooltip title="Фильтры">
                    <FilterAltIcon
                      className={'w-[1.5rem] h-[1.5rem] mx-1'}
                      sx={{
                        // @ts-ignore
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={showFiltersHandler}
                    />
                  </Tooltip>
                  {isCurrentClientHasClientCode && <Tooltip title="Создать новый груз">
                    <AddIcon
                      className={'w-[1.5rem] h-[1.5rem]'}
                      sx={{
                        // @ts-ignore
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                  </Tooltip>}
                </>
              </Grid>}
            </Grid>
          </Grid>

          {/* Filters */}
          <FiltersGridWrap isShowFilters={isShowFilters} />

          {/* Tabs */}
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              onClick={() => archiveItemsToggle(false)}
              className={currentCargosBtnClassNames}
            >
              Текущие
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              onClick={() => archiveItemsToggle(true)}
              className={archiveCargosBtnClassNames}
            >
              Архивные
            </Button>
          </Grid>

          <Grid item xs={12}>
            {
              !Array.isArray(cargos) || cargos?.length === 0
                ? <>
                  <p>Нет грузов</p>
                </>
                : <>
                  {cargos.map((cargo, index) => {
                    const isLastEl = Boolean(cargos.length - 1 === index)

                    return (
                      <Fragment key={cargo.id}>
                        <CargosListItem
                          item={cargo}
                          selectCurrentCargoHandler={selectCurrentCargoHandler}
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

export default CargosList
