import { observer } from "mobx-react-lite"

// shared
import { SubmitButton } from "@/shared/ui/SubmitButton"

import { UserStore } from "@/entities/User"

export const FormSubmitButton = observer(() => {
  const isLoading = UserStore.user.isLoading

  return (
    <>
      <SubmitButton
        text="Сохранить"
        isLoading={isLoading}
      />
    </>
  )
})

