import { forwardRef, useMemo } from 'react'

// mui
import { useTheme } from '@mui/material/styles'
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

// shared
import { TFixMeInTheFuture } from '@/shared/types/types'
import {ICustomTheme} from "@/shared/lib/themes/theme"

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
}

// ==============================|| CUSTOM MAIN CARD ||============================== //
// MainCard.propTypes = {
//     border: PropTypes.bool,
//     boxShadow: PropTypes.bool,
//     children: PropTypes.node,
//     content: PropTypes.bool,
//     contentClass: PropTypes.string,
//     contentSX: PropTypes.object,
//     darkTitle: PropTypes.bool,
//     secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
//     shadow: PropTypes.string,
//     sx: PropTypes.object,
//     title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
// isHeightFull: boolean
// isScrollable: boolean
// }

export interface IMainCardProps {

}

export const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            isHeightFull,
            isScrollable,
            ...others
        }: TFixMeInTheFuture,
        ref
    ) => {
        const theme = useTheme<ICustomTheme>()

        const scrollableStyles = useMemo(() => {
          return isScrollable ? {
            minHeight: '77vh',
            maxHeight: '77vh',
            overflow: 'auto',
            overflowX: 'hidden',
          } : {}
        }, [isScrollable])

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                  height: isHeightFull ? '100%' : 'auto',
                  ...scrollableStyles,
                  border: border ? '1px solid' : 'none',
                  // @ts-ignore
                  borderColor: theme.palette.primary[200] + 25,
                  ':hover': {
                      boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
                  },
                  ...sx
                }}
            >
                <div>
                  {/* card header and action */}
                  {title && (
                    <CardHeader
                      sx={headerSX}
                      title={darkTitle ? <Typography variant="h3">{title}</Typography> : title}
                      action={secondary}
                    />
                  )}

                  {/* content & header divider */}
                  {title && <Divider />}

                  {/* card content */}
                  {content && (
                    <CardContent sx={contentSX} className={contentClass}>
                      {children}
                    </CardContent>
                  )}
                  {!content && children}
                </div>
            </Card>
        )
    }
)

MainCard.displayName = 'MainCard'
