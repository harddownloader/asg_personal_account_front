import { observer } from "mobx-react-lite"

// shared
import { SubmitButton } from "@/shared/ui/SubmitButton/SubmitButton"

// store
import { CargosStore } from "@/entities/Cargo"

export const SaveCargoButton = observer(function SaveCargoButton() {
  const isLoading = CargosStore.cargos.isLoading

  return (
    <>
      <SubmitButton
        text="Сохранить"
        isLoading={isLoading}
      />
    </>
  )
})

