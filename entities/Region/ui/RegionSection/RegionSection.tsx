import React, { useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite"
import { IconWorld } from "@tabler/icons-react"
import {
  Avatar,
  Box,
  ButtonBase,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// components
import { RegionList } from "./RegionList"

// assets
import classes from './RegionSection.module.scss'

// entities
import { RegionsStore } from "@/entities/Region"

// shared
import { Transitions } from "@/shared/ui/extended/Transitions"
import { MainCard } from "@/shared/ui/cards/MainCard"
import { getCountryFlagImage } from "@/entities/Region/lib"
import { ICustomTheme } from "@/shared/lib/themes/theme"


export const RegionSection = observer(() => {
  const theme = useTheme<ICustomTheme>()
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'))

  const regions = [...RegionsStore.regions.items]
  const currentRegion = RegionsStore.regions.currentItem

  const [isOpen, setIsOpen] = useState<boolean>(false)

  // FIX - Error: Hydration failed because the initial UI does not match what was rendered on the server.
  const [isClient, setIsClient] = useState<boolean>(false)

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: (MouseEvent | TouchEvent)) => {
    // @ts-ignore
    if (anchorRef.current?.contains(event.target)) {
      return
    }
    setIsOpen(false)
  }

  const prevOpen = useRef<boolean>(isOpen)
  useEffect(() => {
    if (prevOpen.current && !isOpen) {
      (anchorRef.current as HTMLDivElement).focus()
    }
    prevOpen.current = isOpen
  }, [isOpen])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <>
        <Box>
          <Tooltip title={'Регионы'}>
            <ButtonBase sx={{}}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  borderRadius: '4px',
                  transition: 'all .2s ease-in-out',
                  background: theme.palette.common.white,
                  color: theme.palette.primary.main,
                  '&[aria-controls="menu-list-grow"],&:hover': {
                    background: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    border: `1px ${theme.palette.common.white} solid`,
                  }
                }}
                ref={anchorRef}
                aria-controls={isOpen ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
              >
                {isClient && currentRegion?.name
                  ? <div className={'border border-1 border-brand'}>
                    {getCountryFlagImage({
                      countryShortname: currentRegion.name,
                      width: 15,
                      height: 15
                    })}
                  </div>
                  : <IconWorld stroke={1.5} size="1.3rem" />}
              </Avatar>
            </ButtonBase>
          </Tooltip>
        </Box>
        <Popper
          placement={matchesXs ? 'bottom' : 'bottom-end'}
          open={isOpen}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [matchesXs ? 5 : 0, 20]
                }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions
                position={matchesXs ? 'top' : 'top-right'}
                in={isOpen}
                {...TransitionProps}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">Все регионы</Typography>
                            </Stack>
                          </Grid>
                          <Grid item>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={classes.regions_list_wrap}>
                          <RegionList regions={regions} />
                        </div>
                      </Grid>
                    </Grid>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </>
    </>
  )
})
