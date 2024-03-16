import {
  useState,
  useMemo,
  Fragment,
  useCallback
} from "react"
import { observer } from "mobx-react-lite"

// mui
import {
  Button,
  Divider,
  Grid,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// project components
import { CargosListItem } from '@/widgets/CargosBlock/CargosList/CargosListItem'
import { AddCargoDialog } from "@/widgets/CargosBlock/CargosList/AddCargoDialog/AddCargoDialog"
import { ScrollableBlock } from "@/shared/ui/ScrollableBlock"
import { FiltersGridWrap } from "@/widgets/CargosBlock/CargosList/Filters"
import { Head } from "@/widgets/CargosBlock/CargosList/Head"

// shared
import { GRID_SPACING } from "@/shared/const"
import { ICustomTheme } from "@/shared/lib/themes/theme"

// store
import {
  CargosStore,
  CargosListView,
} from '@/entities/Cargo'
import type { ICargoFull } from '@/entities/Cargo'
import { ClientsStore } from "@/entities/User"
import type { IUserOfDB } from "@/entities/User"

export interface CargosListProps {
  isLoading: boolean
  title?: string
  isCurrentUserManager: boolean
  isCurrentClientHasClientCode: boolean
  showConfirmToLeave?: Function
  currentClient: IUserOfDB | null
}

const getToggleBtnClass = (isActive: boolean): string => {
  const dynamicClasses = isActive
    ? `bg-brand hover:bg-white border-white hover:border-brand text-white hover:text-brand`
    : `bg-white hover:bg-brand border-brand hover:border-white text-brand hover:text-white`
  const staticClasses = `border-solid border font-bold rounded h-14 mt-4`
  return `${dynamicClasses} ${staticClasses}`
}

export const CargosList = observer(({
                                      isLoading,
                                      title="Список грузов",
                                      isCurrentUserManager,
                                      isCurrentClientHasClientCode,
                                      showConfirmToLeave,
                                      currentClient,
                           }: CargosListProps) => {
  const theme = useTheme<ICustomTheme>()
  // @ts-ignore
  const iconsColor = theme.palette.primary[200]

  const cargos: Array<ICargoFull> = useMemo(
    () => ([...CargosStore.cargos.currentItemsList]),
    [JSON.stringify([CargosStore.cargos.currentItemsList])]
  )
  const isArchive = CargosStore.cargos.isCurrentItemsListArchive
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    //  open modal
    setIsOpenAddModal(true)
  }, [])

  const handleCloseModal = () => {
    setIsOpenAddModal(false)
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
    // if we are here from all cargos list(not by users)
    if (isCurrentUserManager && (
      !currentClient?.id ||
      cargo.clientCode !== currentClient.userCodeId
    )) {
      const clientOfCargo = ClientsStore.clients.items.find((client) => client.userCodeId === cargo.clientCode)
      if (clientOfCargo) ClientsStore.setCurrentItem({...clientOfCargo})
    }
    CargosStore.setCurrentItem({...cargo})
  }

  const isShowFilters = CargosStore.filtersOfList.isShowFilters
  const showFiltersHandler = useCallback(() => {
    CargosStore.toggleShowingFilters(!isShowFilters)
  }, [isShowFilters])

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
              clientCode={currentClient?.userCodeId
                ? currentClient.userCodeId
                : null
              }
              clientId={currentClient?.id
                ? currentClient.id
                : null
              }
            />}
          </>
        }
        >
        <Grid container spacing={GRID_SPACING}>
          <Head
            title={title || ""}
            isCurrentUserManager={isCurrentUserManager}
            showFiltersHandler={showFiltersHandler}
            isCurrentClientHasClientCode={isCurrentClientHasClientCode}
            handleClick={handleClick}
            iconsColor={iconsColor}
          />

          {/* Filters */}
          <FiltersGridWrap isShowFilters={isShowFilters} />

          {/* Tabs */}
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              onClick={() => CargosListView.archiveItemsToggle(false)}
              // onClick={() => CargosStore.archiveItemsToggle(false)}
              className={currentCargosBtnClassNames}
            >
              Текущие
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              onClick={() => CargosListView.archiveItemsToggle(true)}
              // onClick={() => CargosStore.archiveItemsToggle(true)}
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

CargosList.displayName = 'CargosList'
