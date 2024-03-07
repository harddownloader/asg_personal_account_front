import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Control, Controller, FieldErrors } from "react-hook-form"
import { FormControl, InputAdornment, ListSubheader, MenuItem, TextField } from "@mui/material";
import { CountryCode, Examples, getExampleNumber } from "libphonenumber-js/min"
import ru from "react-phone-number-input/locale/ru.json"
import { getCountries, getCountryCallingCode } from "react-phone-number-input/input"

import Select from "@mui/material/Select"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import SearchIcon from "@mui/icons-material/Search"

// widgets
import { TSearchText } from "@/widgets/CargosBlock/CargosForm/ToneField/ToneField"

// assets
import classes from "./PhoneField.module.scss"

// const
import { PHONE_FIELD_NAME, COUNTRY_FIELD_NAME, IRegisterUserDataFull, TCountryState } from './Registration'

const containsText = (text: string, searchText: string) => {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
}

const getOptionName = (countryCode: CountryCode) => {
  return `${ru[countryCode]} +${getCountryCallingCode(countryCode)}`
}

const searchTextDefaultValue = ''

export interface IPhoneFieldComponentProps {
  controlForm: Control<IRegisterUserDataFull, any>
  errorsForm: FieldErrors<IRegisterUserDataFull>
  country: TCountryState
  setCountryHandler: (country: TCountryState) => void
  className?: string
}

export const PhoneFieldComponent = ({
                                      controlForm,
                                      errorsForm,
                                      country,
                                      setCountryHandler,
                                      className,
}: IPhoneFieldComponentProps) => {
  const [searchText, setSearchText] = useState<TSearchText>(searchTextDefaultValue)
  const [placeholder, setPlaceholder] = useState<string>(() => {
    return country
      ? `${getExampleNumber(
        country,
        { [`${country as CountryCode}`]: `${Math.floor(Math.random() * 1000000000)}`} as Examples
      )?.number}`
      : ''
  })

  useEffect(() => {
    setPlaceholder(country
      ? `${getExampleNumber(
        country,
        { [`${country as CountryCode}`]: `${Math.floor(Math.random() * 1000000000)}`} as Examples
      )?.number}`
      : '')
  }, [country]);

  const onSearchInputKeyDown = (e: { key: string; stopPropagation: () => void }) => {
    if (e.key !== 'Escape') {
      // Prevents auto selecting item while typing (default Select behaviour)
      e.stopPropagation()
    }
  }

  const onSelectClose = () => {
    setSearchText(searchTextDefaultValue)
  }

  const countryCodes = getCountries()

  const displayedOptions = useMemo(
    () =>
      countryCodes.filter((countryCode: CountryCode) => {
        return containsText(getOptionName(countryCode), searchText)
      }),
    [searchText]
  )
  const optionsList = displayedOptions.map((countryCode) => {
    return (
      <MenuItem key={countryCode} value={countryCode}>
        {getOptionName(countryCode)}
      </MenuItem>
    )
  })

  const selectOnChange = (event: SelectChangeEvent, child: React.ReactNode) => {
    setCountryHandler((event.target.value as CountryCode))
  }

  return (
    <>
      <Controller
        name={PHONE_FIELD_NAME}
        control={controlForm}
        render={({
                   field: { onChange, onBlur, value, name, ref },
                   fieldState: { invalid, isTouched, isDirty, error },
                   formState,
                 }) => (
          <TextField
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            value={value}
            ref={ref}
            id={PHONE_FIELD_NAME}
            placeholder={placeholder} // Ваш телефон
            className={`${classes.phoneNumberTextField} ${className}`}
            margin="normal"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <FormControl>
                  <Controller
                    name={COUNTRY_FIELD_NAME}
                    control={controlForm}
                    render={({
                               field: { onChange, onBlur, value, name, ref },
                               fieldState: { invalid, isTouched, isDirty, error },
                               formState,
                             }) => (
                      <Select
                        MenuProps={{
                          autoFocus: false,
                          classes: {
                            paper: classes.paper,
                            list: classes.list
                          }
                        }}
                        onBlur={onBlur}
                        onChange={(...args) => {
                          selectOnChange(...args)
                          onChange(...args)
                        }}
                        onClose={onSelectClose}
                        value={value}
                        inputRef={ref}
                        labelId={`${PHONE_FIELD_NAME}-${COUNTRY_FIELD_NAME}-flag`}
                        label={`${COUNTRY_FIELD_NAME}-flag`}
                        id={`${COUNTRY_FIELD_NAME}-flag`}
                        name={name}
                        className={classes.countryFlagSelect}
                        renderValue={(selected) => {
                          return <Image
                            width={50}
                            height={30}
                            alt={'flag'}
                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selected}.svg`}
                          />
                        }}
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
                              )
                            }}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={onSearchInputKeyDown}
                          />
                        </ListSubheader>
                        {optionsList}
                      </Select>
                    )
                    }
                  />
                </FormControl>
              )
            }}
          />
        )}
      />
      {!!errorsForm.phone && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.phone?.message}</p>
      )}
    </>
  )
}
