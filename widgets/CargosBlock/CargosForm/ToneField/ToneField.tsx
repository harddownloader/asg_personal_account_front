import React, { useState, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Controller } from "react-hook-form"

// mui
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment,
  OutlinedInput,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddBoxIcon from '@mui/icons-material/AddBox'

// project components
import { AddToneButton } from "@/widgets/CargosBlock/CargosForm/ToneField/AddToneButton"

// assets
import classes from './ToneField.module.scss'

// store
import { ToneStore, ITone } from "@/entities/Tone"

// entities
import { CARGO_FIELD_NAMES } from "@/entities/Cargo"



const containsText = (text: string, searchText: string) => {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
}

const labelId = `label-${CARGO_FIELD_NAMES.TONE.value}`
const searchTextDefaultValue = ""

export const ToneField = observer(function ToneField({
                                                       isDisabled,
                                                       formControl: {
                                                         registerForm,
                                                         errorsForm,
                                                         setErrorForm,
                                                         clearErrorsForm,
                                                         control,
                                                         formDefaultValues,
                                                         reset,
                                                         getValues,
                                                         setValue,
                                                       }
                                                     }) {
  const allTones: ITone[] = [...ToneStore.tones.items]
  // const [selectedOption, setSelectedOption] = useState<ITone | null>(formDefaultValues.tone || null)

  // useEffect(() => {
  //   console.log('tone field useEffect')
  //   setTimeout(() => {
  //     setValue(CARGO_FIELD_NAMES.TONE.value, "9114f974-6c7a-4c02-83d5-fcc9f7d000e4", { shouldValidate: true })
  //   }, 1000)
  // }, [setValue])

  const [searchText, setSearchText] = useState<string>(searchTextDefaultValue)
  /*
  * This warning in the console - is ok!
  * MUI: You have provided an out-of-range value `.....` for the select component.
  * Consider providing a value that matches one of the available options or ''.
  * The available values are "".
  * */
  const displayedOptions = useMemo(
    () => allTones.filter((option: ITone) => {
        return containsText(option.label, searchText)
      }),
    [searchText, allTones?.length]
  )

  const optionsList = displayedOptions.map((option: ITone) => {
    return <MenuItem key={option._id} value={option._id}>
      {option.label}
    </MenuItem>
  })

  const onSelectClose = () => {
    setSearchText(searchTextDefaultValue)
  }

  const onSelectChange = (e, onChangeAdditionalCallback) => {
    console.log('getValues before', getValues(CARGO_FIELD_NAMES.TONE.value))
    clearErrorsForm(CARGO_FIELD_NAMES.TONE.value)
    onChangeAdditionalCallback(e)
    console.log('getValues after', getValues(CARGO_FIELD_NAMES.TONE.value))
  }

  const onSearchInputKeyDown = (e) => {
    if (e.key !== "Escape") {
      // Prevents auto selecting item while typing (default Select behaviour)
      e.stopPropagation()
    }
  }

  return (
    <Box className={`${classes.dropdown}`}>
      <FormControl
        fullWidth
        id={CARGO_FIELD_NAMES.TONE.value}
      >
        <InputLabel id={labelId}>
          {CARGO_FIELD_NAMES.TONE.label}
        </InputLabel>
        <Controller
          name={CARGO_FIELD_NAMES.TONE.value}
          control={control}
          defaultValue=""
          // defaultValue={'9114f974-6c7a-4c02-83d5-fcc9f7d000e4' || formDefaultValues?.tone}
          render={({ field: { onChange, onBlur, value, ref }}) => (
            <Select
              MenuProps={{ autoFocus: false }}
              labelId={labelId}
              fullWidth
              disabled={isDisabled}
              input={<OutlinedInput id="outlined-input" label="Chip" />}
              onClose={onSelectClose}
              // onChange={(e) => setSelectedOption(e.target.value)}
              // renderValue={() => selectedOption?.label}
              onChange={(e) => onSelectChange(e, onChange)}
              onBlur={onBlur}
              value={value}
              ref={ref}
            >
              <ListSubheader>
                <TextField
                  size="small"
                  // Autofocus on text field
                  autoFocus
                  placeholder="Поиск..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchText &&
                          <AddToneButton
                            searchText={searchText}
                            clearErrorsForm={clearErrorsForm}
                            setErrorForm={setErrorForm}
                            setValue={setValue}
                          />
                        }
                      </InputAdornment>
                    )
                  }}
                  onChange={(e) => {
                    // setValue(CARGO_FIELD_NAMES.TONE.value, 'testtest')
                    // setValue(CARGO_FIELD_NAMES.TONE.value, {
                    //   "label": "test3",
                    //   "updatedAt": "2023-11-25T03:01:22.465Z",
                    //   "createdAt": "2023-11-25T03:01:22.465Z",
                    //   "id": "4878498e-187e-471d-936c-b6a14d6fad1c"
                    // })
                    setSearchText(e.target.value)
                  }}
                  onKeyDown={onSearchInputKeyDown}
                />
                {!!errorsForm.toneId && (
                  <p className="text-sm text-red-500 py-2">{errorsForm.toneId?.message}</p>
                )}
              </ListSubheader>
              {optionsList}
            </Select>
          )}
        />
      </FormControl>
      {!!errorsForm.toneId && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.toneId?.message}</p>
      )}
    </Box>
  )
})
