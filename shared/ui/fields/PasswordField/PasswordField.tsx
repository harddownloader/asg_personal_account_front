import React, {
  useRef,
  useState,
  ReactElement,
  MouseEvent,
} from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

// mui
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Visibility from "@mui/icons-material/Visibility"


export interface IPasswordFieldProps {
  id: string
  registerFormFunc: UseFormRegisterReturn
  placeholder: string
  label: string | null
  errorsFormJSX: ReactElement | null
  className?: string
}

export const PasswordField = ({
                                id,
                                registerFormFunc,
                                placeholder,
                                label,
                                errorsFormJSX,
                                className="bg-white rounded"
                       }: IPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const fieldRef = useRef<HTMLInputElement>(null)

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)

    if (fieldRef?.current === null) return

    setTimeout(() => {
      fieldRef.current!.focus()
      fieldRef.current!.selectionStart = fieldRef.current!.value.length
      fieldRef.current!.selectionEnd = fieldRef.current!.value.length
    }, 0)
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
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
        className={className}
        {...registerFormFunc}
        inputRef={fieldRef}
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
