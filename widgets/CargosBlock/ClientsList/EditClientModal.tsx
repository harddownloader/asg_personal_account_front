import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

// project components
import { EditForm } from "@/widgets/ClientProfileForm"
import { DialogHOC } from "@/widgets/Dialog/Modal/DialogHOC"

// store
import {
  // types
  ISaveClientProfile,
  IUserOfDB,
  TUserSavingResponse,

  // const
  USER_ROLE,

  // store
  UserStore,
} from "@/entities/User"
import { ClientsStore } from '@/entities/User'

export interface EditClientModalProps {
  isVisible: boolean,
  handleCancel: () => void,
  client: IUserOfDB | null
}

export const EditClientModal = ({
                                  isVisible,
                                  handleCancel,
                                  client,
                                }: EditClientModalProps) => {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    reset,
  } = useForm<ISaveClientProfile>({
    defaultValues: {}
  })

  useEffect(() => {
    if (client?.id) {
      reset({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        city: client?.city ? client.city : '',
        userCodeId: client?.userCodeId ? client.userCodeId : '',
        role: client?.role,
      })
    }
  }, [client?.id])

  const handleEditClient = handleSubmitForm(async ({
                                                     name,
                                                     phone,
                                                     email,
                                                     city,
                                                     userCodeId,
                                                     role,
                                               }: ISaveClientProfile): Promise<void> => {
    if (!client?.id) return

    const { data }: TUserSavingResponse = await ClientsStore.saveClientProfile({
      name,
      phone,
      email,
      city,
      userCodeId,
      id: client.id,
      country: client.country,
      role,
    })

    if (data?.accountSaving?.errors.length) {
      // Unable to sign in.
      data?.accountSaving?.errors.forEach((e) => {
        if (e.field === "name") {
          setErrorForm("name", { message: e.message! })
        } else if (e.field === "phone") {
          setErrorForm("phone", { message: e.message! })
        } else if (e.field === "email") {
          setErrorForm("email", { message: e.message! })
        } else if (e.field === "city") {
          setErrorForm("city", { message: e.message! })
        } else {
          console.error("Registration error:", e)
        }
      })

      return
    }

    handleCancel && handleCancel()

    return
  })

  return (
    <>
      <DialogHOC
        isMobileVersion={false}
        isVisible={isVisible}
        title={'Редактирование клиента'}
        handleClose={handleCancel}
        confirm={null}
        childrenFooter={
          <></>
        }
        maxWidth={'sm'}
      >
        <EditForm
          title={'Редактирование клиента'}
          isAdmin={UserStore.user.currentUser?.role === USER_ROLE.ADMIN}
          handleSubmit={handleEditClient}
          formControl={{
            registerForm,
            errorsForm,
            setErrorForm,
          }}
        />
      </DialogHOC>
    </>
  )
}
