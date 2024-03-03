import { createTheme } from '@mui/material/styles'
import { Theme, ThemeOptions } from "@mui/material/styles/createTheme"
import { DefaultTheme } from "@mui/system"

// assets
import colors from '@/shared/styles/_themes-vars.module.scss'

// project imports
import { componentStyleOverrides } from '@/shared/lib/themes/compStyleOverride'
import {ICustomPalette, ICustomPaletteOptions, themePalette} from '@/shared/lib/themes/palette'
import {IThemeTypography, themeTypography, TThemeTypographyReturn} from '@/shared/lib/themes/typography'
import { customizationInterface } from "@/shared/lib/themes/index"
import { TFixMeInTheFuture } from "@/shared/types/types"

export interface IThemeOption {
  colors: {[p: string]: string}
  heading: string
  paper: string
  backgroundDefault: string
  background: string
  darkTextPrimary: string
  darkTextSecondary: string
  textDark: string
  menuSelected: string
  menuSelectedBack: string
  divider: string
  customization: customizationInterface
}

export interface ICustomThemeOptions extends ThemeOptions {
  typography: TThemeTypographyReturn
}

export interface ICustomTheme extends Omit<Theme, 'typography' | 'palette'> {
  typography: IThemeTypography
  palette: ICustomPalette
}

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization: customizationInterface): Partial<DefaultTheme> | ((outerTheme: DefaultTheme) => DefaultTheme) => {
  const color = colors

  const themeOption: IThemeOption = {
    colors: color,
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.paper,
    menuSelectedBack: color.primaryMain,
    divider: color.grey200,
    customization
  }

  const themeOptions: ICustomThemeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  }

  const themes = createTheme(themeOptions)
  themes.components = componentStyleOverrides(themeOption)

  return themes
}
