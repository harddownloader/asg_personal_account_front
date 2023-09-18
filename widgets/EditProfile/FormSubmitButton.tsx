import { observer } from "mobx-react-lite"
import { SubmitButton } from "@/shared/ui/SubmitButton/SubmitButton"
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
