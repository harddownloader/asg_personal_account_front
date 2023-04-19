import React, {
  ReactElement,
  useState,
} from 'react'
import { RegisterOptions, UseFormRegisterReturn } from 'react-hook-form'

// mui
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Visibility from "@mui/icons-material/Visibility"

export const PasswordField = ({
                                id,
                                registerFormFunc,
                                placeholder,
                                label,
                                errorsFormJSX,
                       }: {
  id: string
  registerFormFunc: UseFormRegisterReturn
  placeholder: string
  label: string | null
  errorsFormJSX: ReactElement | null
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const defaultPlaceholder = "Введите ваш текущий пароль"
  const defaultLabel = "Текущий пароль"
  const idDefault = "currentPassword"

  const CurrentPasswordField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder={placeholder || defaultPlaceholder}
        id={id || idDefault}
        label={label !== undefined ? label : defaultLabel}
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerFormFunc}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }}
      />
      {errorsFormJSX && errorsFormJSX}
    </>
  )

  return (
    <>
      {CurrentPasswordField}
    </>
  )
}

export default PasswordField
