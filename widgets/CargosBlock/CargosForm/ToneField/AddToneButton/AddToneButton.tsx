import React from "react"
import { observer } from "mobx-react-lite"

// mui
import AddBoxIcon from "@mui/icons-material/AddBox"

// entities
import { CARGO_FIELD_NAMES } from "@/entities/Cargo"
import { ToneStore } from "@/entities/Tone"

// shared
import { Preloader } from "@/shared/ui/Preloader"

// assets
import classes from "./AddToneButton.module.scss"


export const AddToneButton = observer(function AddToneButton({
                                searchText,
                                clearErrorsForm,
                                setErrorForm,
                                                               setValue,
                              }) {
  const onClickHandler = async () => {
    console.log('add')
    await clearErrorsForm(CARGO_FIELD_NAMES.TONE.value)

    const { data } = await ToneStore.add(searchText)

    if (data?.addingTone?.errors.length) {
      data?.addingTone?.errors.forEach((e) => {
        if (e.field === CARGO_FIELD_NAMES.TONE.value) {
          setErrorForm(
            CARGO_FIELD_NAMES.TONE.value, /* CARGO_FIELD_NAMES.TONE.value = 'toneId' */
            { message: e.message! }
          )
        }
      })

      return
    }


    // setValue(CARGO_FIELD_NAMES.TONE.value, "9114f974-6c7a-4c02-83d5-fcc9f7d000e4", { shouldValidate: true })
    await setValue(CARGO_FIELD_NAMES.TONE.value, data.addingTone.newTone?._id, { shouldValidate: true })
  }

  return (
    <>
      { ToneStore.tones.isLoading
        ? <Preloader />
        : <AddBoxIcon
            className={`${classes.add_tone_btn} text-brand`}
            onClick={onClickHandler}
          />
      }
    </>
  )
})

