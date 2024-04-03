import React, { useState, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Controller } from 'react-hook-form'

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
  SelectChangeEvent
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// project components
import { AddToneButton } from '@/widgets/CargosBlock/CargosForm/ToneField/AddToneButton'

// assets
import classes from './ToneField.module.scss'

// store
import { ToneStore, ITone } from '@/entities/Tone'

// entities
import { CARGO_FIELD_NAMES } from '@/entities/Cargo'
import { ICargoInfoFormControl } from '../CargosForm'

export interface IToneFieldProps {
  isDisabled: boolean
  formControl: ICargoInfoFormControl
}

const containsText = (text: string, searchText: string) => {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
}

const labelId = `label-${CARGO_FIELD_NAMES.TONE.value}`
const searchTextDefaultValue = ''

export type TSearchText = string

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
    setValue
  }
}: IToneFieldProps) {
  const allTones: ITone[] = [...ToneStore.tones.items]

  const [searchText, setSearchText] = useState<TSearchText>(searchTextDefaultValue)

  const displayedOptions = useMemo(
    () =>
      allTones.filter((option: ITone) => {
        return containsText(option.label, searchText)
      }),
    [searchText, allTones?.length]
  )

  const optionsList = displayedOptions.map((option: ITone) => {
    return (
      <MenuItem key={option.id} value={option.id}>
        {option.label}
      </MenuItem>
    )
  })

  const onSelectClose = () => {
    setSearchText(searchTextDefaultValue)
  }

  const onSelectChange = (
    e: SelectChangeEvent<any>,
    onChangeAdditionalCallback: { (...event: any[]): void; (arg0: any): void }
  ) => {
    clearErrorsForm(CARGO_FIELD_NAMES.TONE.value)
    onChangeAdditionalCallback(e)
  }

  const onSearchInputKeyDown = (e: { key: string; stopPropagation: () => void }) => {
    if (e.key !== 'Escape') {
      // Prevents auto selecting item while typing (default Select behaviour)
      e.stopPropagation()
    }
  }

  return (
    <Box className={`${classes.dropdown}`}>
      <FormControl fullWidth id={CARGO_FIELD_NAMES.TONE.value} required>
        <InputLabel id={labelId}>Дата вылета</InputLabel>
        <Controller
          name={CARGO_FIELD_NAMES.TONE.value}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              MenuProps={{
                autoFocus: false,
                classes: {
                  paper: classes.paper,
                  list: classes.list
                }
              }}
              labelId={labelId}
              fullWidth
              required
              disabled={isDisabled}
              input={<OutlinedInput id="outlined-input" label={CARGO_FIELD_NAMES.TONE.label} />}
              onClose={onSelectClose}
              onChange={e => onSelectChange(e, onChange)}
              onBlur={onBlur}
              value={value}
              ref={ref}
            >
              <ListSubheader>
                <TextField
                  className={classes.search_field}
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
                        {searchText && (
                          <AddToneButton
                            searchText={searchText}
                            clearErrorsForm={clearErrorsForm}
                            setErrorForm={setErrorForm}
                            setValue={setValue}
                          />
                        )}
                      </InputAdornment>
                    )
                  }}
                  onChange={e => setSearchText(e.target.value)}
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
