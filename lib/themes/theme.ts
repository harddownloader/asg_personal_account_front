import { createTheme } from '@mui/material/styles'

// assets
import colors from '@/styles/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from '@/lib/themes/compStyleOverride'
import themePalette from '@/lib/themes/palette'
import themeTypography from '@/lib/themes/typography'
import { customizationInterface } from "@/lib/themes"
import {fixMeInTheFuture} from "@/lib/types";

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization: customizationInterface) => {
  const color = colors

  const themeOption = {
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

  const themeOptions: fixMeInTheFuture = {
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

export default theme