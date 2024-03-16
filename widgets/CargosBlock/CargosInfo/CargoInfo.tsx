'use client'

import { useMemo } from "react"
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
  const currentCargo = useMemo(
    () => CargosStore.cargos?.currentItem,
    [CargosStore.cargos?.currentItem?.id]
  )

  const getContent = () => {
    const cargoAndClientExit = currentCargo?.id && currentClient?.id

    return cargoAndClientExit &&
      <CargoContent
        isFull={isFull}
        title={title}
        currentCargo={currentCargo}
        currentClient={currentClient}
      />
  }

  return (
    <>
      <ScrollableBlock
        isLoading={false}
        isScrollable
      >
        {getContent()}
      </ScrollableBlock>
    </>
  )
})
