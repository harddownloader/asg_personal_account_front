import { memo, useState } from 'react'
import { observer } from 'mobx-react-lite'

// mui
import { useTheme } from '@mui/material/styles'
import { Box, Collapse, Drawer, Grid, Typography, useMediaQuery } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'

// project components
import { MenuList } from './MenuList'
import { LogoSection } from '@/widgets/LogoSection'

// shared
import { DRAWER_WIDTH } from '@/shared/const'
import { ITone, ToneStore } from '@/entities/Tone'
import { ScrollableBlock } from '@/shared/ui/ScrollableBlock'
import { CargosStore } from '@/entities/Cargo'

export interface SidebarProps {
  drawerOpen: boolean
  drawerToggle: () => void
}

export const Sidebar = observer(({ drawerOpen, drawerToggle }: SidebarProps) => {
  const [isShown, setIsShown] = useState<boolean>(false)
  const theme = useTheme()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
  const allTones: ITone[] = [...ToneStore.tones.items]
  const currentToneId: string = ToneStore.tones.currentToneId

  const handleChangeCurrentToneId = (toneId: string) => {
    if (currentToneId && toneId === currentToneId) {
      ToneStore.clearCurrentToneId()
      CargosStore.setCurrentItemsListByStatus({
        isArchive: CargosStore.cargos.isCurrentItemsListArchive
      })
    } else {
      ToneStore.setCurrentToneId(toneId)
    }
  }

  const drawer = (
    <>
      <div className="bg-brand">
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
            <LogoSection />
          </Box>
        </Box>
      </div>
      <MenuList />
      <ScrollableBlock
        isLoading={false}
        isScrollable
        style={{
          minHeight: 'calc(77vh - 70px)',
          maxHeight: 'calc(77vh - 70px)',
          background: 'inherit',
          marginLeft: '6px',
          marginRight: '6px'
        }}
      >
        Список тонн
        {allTones.map((tone, index) => {
          const toneActive = tone._id === currentToneId

          return (
            <Grid
              key={index}
              item
              onMouseEnter={() => setIsShown(true)}
              onMouseLeave={() => setIsShown(false)}
              onClick={() => handleChangeCurrentToneId(tone._id)}
              className={`flex items-center ${
                toneActive ? 'bg-brand text-white' : ''
              } transition-all cursor-pointer rounded p-1 hover:bg-brand hover:text-white`}
              style={{ marginTop: '2px' }}
            >
              <Collapse in={!toneActive && isShown} timeout={200} orientation={'horizontal'}>
                <PanoramaFishEyeIcon className={'w-[1.5rem] h-[1.5rem] mr-1'} />
              </Collapse>
              <Collapse in={toneActive} timeout={200} orientation={'horizontal'}>
                <CheckCircleIcon className={'w-[1.5rem] h-[1.5rem] mr-1'} />
              </Collapse>

              <Typography className={'font-bold'} variant="subtitle1" color="inherit">
                {tone.label}
              </Typography>
            </Grid>
          )
        })}
      </ScrollableBlock>
    </>
  )

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? DRAWER_WIDTH : 'auto'
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  )
})

Sidebar.displayName = 'Sidebar'
