// @ts-nocheck
import { ReactElement, useEffect, useState } from 'react'
import Link from 'next/link'

// mui
import { useTheme } from '@mui/material/styles'
import { Box, Card, Divider, Grid, Typography } from '@mui/material'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'

// utils
import { GRID_SPACING, BASE_NAME } from '@/lib/const'

// assets
import {IconSettings, IconTallymark1} from '@tabler/icons-react'
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone'
import HomeIcon from '@mui/icons-material/Home'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import { MenuItemInterface, MenuItemsInterface } from '@/lib/menu'

const linkSX = {
    display: 'flex',
    color: 'grey.900',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
}

// Breadcrumbs.propTypes = {
//     card: PropTypes.bool,
//     divider: PropTypes.bool,
//     icon: PropTypes.bool,
//     icons: PropTypes.bool,
//     maxItems: PropTypes.number,
//     navigation: PropTypes.object,
//     rightAlign: PropTypes.bool,
//     separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
//     title: PropTypes.bool,
//     titleBottom: PropTypes.bool
// }

export interface BreadcrumbsProps {
  isCard: boolean,
  isDivider: boolean,
  isIcon: boolean,
  isIcons: boolean,
  maxItems: number,
  navigation: MenuItemsInterface,
  isRightAlign: boolean,
  separator?: () => ReactElement | ReactElement,
  isTitle: boolean,
  isTitleBottom: boolean
}

export const Breadcrumbs = ({
                              isCard,
                              isDivider,
                              isIcon,
                              isIcons,
                              maxItems,
                              navigation,
                              isRightAlign,
                              separator,
                              isTitle,
                              isTitleBottom,
                              ...others
}: BreadcrumbsProps) => {
    const theme = useTheme()

    const iconStyle = {
        marginRight: theme.spacing(0.75),
        marginTop: `-${theme.spacing(0.25)}`,
        width: '1rem',
        height: '1rem',
        color: theme.palette.secondary.main
    }

    const [main, setMenu] = useState<MenuItemInterface | null>(null)
    const [item, setMenuItem] = useState<MenuItemInterface | null>()

    // set active item state
    const getCollapse = (menu: MenuItemInterface) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === 'collapse') {
                    getCollapse(collapse)
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === BASE_NAME + collapse.url) {
                      setMenu(menu)
                      setMenuItem(collapse)
                    }
                }

                return false
            })
        }
    }

    useEffect(() => {
        navigation?.items?.map((menu) => {
            if (menu.type && menu.type === 'group') {
                getCollapse(menu)
            }

            return false
        })
    })

    // item separator
    const SeparatorIcon = separator
    const separatorIcon = separator
      ? <SeparatorIcon stroke={1.5} size="1rem" />
      : <IconTallymark1 stroke={1.5} size="1rem" />

    let mainContent
    let itemContent
    let breadcrumbContent = <Typography />
    let itemTitle = ''
    let CollapseIcon
    let ItemIcon

    // collapse item
    if (main && main.type === 'collapse') {
        CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon
        mainContent = (
            <Typography
              component={Link}
              href="#"
              variant="subtitle1"
              sx={linkSX}
            >
                {isIcons && <CollapseIcon style={iconStyle} />}
                {main.title}
            </Typography>
        )
    }

    // items
    if (item && item.type === 'item') {
        itemTitle = item.title

        ItemIcon = item.icon ? item.icon : AccountTreeTwoToneIcon
        itemContent = (
            <Typography
                variant="subtitle1"
                sx={{
                    display: 'flex',
                    textDecoration: 'none',
                    alignContent: 'center',
                    alignItems: 'center',
                    color: 'grey.500'
                }}
            >
                {isIcons && <ItemIcon style={iconStyle} />}
                {itemTitle}
            </Typography>
        )

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <Card
                    sx={{
                        marginBottom: isCard === false ? 0 : theme.spacing(GRID_SPACING),
                        border: isCard === false ? 'none' : '1px solid',
                        borderColor: theme.palette.primary[200] + 75,
                        background: isCard === false ? 'transparent' : theme.palette.background.default
                    }}
                    {...others}
                >
                    <Box sx={{ p: 2, pl: isCard === false ? 0 : 2 }}>
                        <Grid
                            container
                            direction={isRightAlign ? 'row' : 'column'}
                            justifyContent={isRightAlign ? 'space-between' : 'flex-start'}
                            alignItems={isRightAlign ? 'center' : 'flex-start'}
                            spacing={1}
                        >
                            {isTitle && !isTitleBottom && (
                                <Grid item>
                                    <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item>
                                <MuiBreadcrumbs
                                    sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                                    aria-label="breadcrumb"
                                    maxItems={maxItems || 8}
                                    separator={separatorIcon}
                                >
                                    <Typography
                                      component={Link}
                                      href="/"
                                      color="inherit"
                                      variant="subtitle1"
                                      sx={linkSX}
                                    >
                                        {isIcons && <HomeTwoToneIcon sx={iconStyle} />}
                                        {isIcon && <HomeIcon sx={{ ...iconStyle, width: '1.5rem', height: '1.5rem', mr: 0 }}  />}
                                        {!isIcon && 'Dashboard'}
                                    </Typography>
                                    {mainContent}
                                    {itemContent}
                                </MuiBreadcrumbs>
                            </Grid>
                            {isTitle && isTitleBottom && (
                                <Grid item>
                                    <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    {
                      isCard === false &&
                      isDivider !== false &&
                      <Divider
                        sx={{
                          borderColor: theme.palette.primary.main,
                          mb: GRID_SPACING
                        }}
                      />
                    }
                </Card>
            )
        }
    }

    return breadcrumbContent
}

export default Breadcrumbs
