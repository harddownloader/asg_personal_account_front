import { useState } from "react"
import { Collapse, Grid, Typography } from "@mui/material"
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useTheme } from "@mui/material/styles"
import { observer } from 'mobx-react-lite'

// entities
import { ITone, ToneStore, TToneId } from "@/entities/Tone"

// shared
import { ScrollableBlock } from "@/shared/ui/ScrollableBlock"
import { ICustomTheme } from '@/shared/lib/themes/theme'

// assets
import classes from './TonesSidebar.module.scss'

export const TonesSidebar = observer(() => {
  const theme = useTheme<ICustomTheme>()

  const [isShown, setIsShown] = useState<boolean>(false)
  const allTones: ITone[] = [...ToneStore.tones.items]
  const currentToneId: TToneId = ToneStore.tones.currentToneId

  const handleChangeCurrentToneId = (toneId: TToneId) => {
    if (currentToneId && toneId === currentToneId) {
      ToneStore.clearCurrentToneId()
    } else {
      ToneStore.setCurrentToneId(toneId)
    }
  }

  return (
    <>

      {/*<span>Список тонн</span>*/}
      <ScrollableBlock
        isLoading={false}
        isScrollable
        style={{
          minHeight: 'calc(77vh - 70px)',
          maxHeight: 'calc(77vh - 70px)',
          background: 'inherit',
          // marginLeft: '6px',
          // marginRight: '6px'
        }}
        // overContent={<Typography
        //   variant="caption"
        //   // @ts-ignore
        //   sx={{ ...theme.typography.menuCaption }}
        //   display="block"
        //   gutterBottom
        // >Список тонн</Typography>}
      >
        {/*<Typography*/}
        {/*  variant="caption"*/}
        {/*  // @ts-ignore*/}
        {/*  sx={{ ...theme.typography.menuCaption }}*/}
        {/*  display="block"*/}
        {/*  gutterBottom*/}
        {/*>Список тонн</Typography>*/}
        {/*<div className={classes.wrap}>*/}
          {allTones ? allTones.map((tone, index) => {
            const toneActive = tone.id === currentToneId

            return (
              <Grid
                key={index}
                item
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
                onClick={() => handleChangeCurrentToneId(tone.id)}
                className={`flex items-center ${
                  toneActive ? 'bg-brand text-white' : ''
                } transition-all cursor-pointer rounded p-1 hover:bg-brand hover:text-white`}
                style={{marginTop: '2px'}}
              >
                <Collapse in={!toneActive && isShown} timeout={200} orientation={'horizontal'}>
                  <PanoramaFishEyeIcon className={'w-[1.5rem] h-[1.5rem] mr-1'}/>
                </Collapse>
                <Collapse in={toneActive} timeout={200} orientation={'horizontal'}>
                  <CheckCircleIcon className={'w-[1.5rem] h-[1.5rem] mr-1'}/>
                </Collapse>

                <Typography className={'font-bold'} variant="subtitle1" color="inherit">
                  {tone.label}
                </Typography>
              </Grid>
            )
          }) : <p>Тонны не были загружены</p>}
        {/*</div>*/}
      </ScrollableBlock>
    </>
  )
})

TonesSidebar.displayName = 'TonesSidebar'
