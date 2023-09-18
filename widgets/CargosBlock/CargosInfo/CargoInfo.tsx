import { observer } from "mobx-react-lite"

// project components
import { ScrollableBlock } from "@/shared/ui/ScrollableBlock"

// store
import { CargosStore } from "@/entities/Cargo"
import type { IUserOfDB } from "@/entities/User"
import { CargoContent } from './CargoContent'

export type TTitle = string
export type TIsFull = boolean

export interface ICargosInfoProps {
  title: TTitle
  isFull: TIsFull
  currentClient: IUserOfDB | null
}

/*
* Edit cargo wrapper component
* */
export const CargosInfo = observer(function CargosInfo({
                                      title,
                                      isFull,
                                      currentClient
}: ICargosInfoProps) {
  // load current cargo
  const currentCargo = CargosStore.cargos?.currentItem

  return (
    <>
      <ScrollableBlock
        isLoading={false}
        isScrollable
      >
        {(currentCargo?.id && currentClient?.id) &&
          <CargoContent
            isFull={isFull}
            title={title}
            currentCargo={currentCargo}
            currentClient={currentClient}
          />
        }
      </ScrollableBlock>
    </>
  )
})
