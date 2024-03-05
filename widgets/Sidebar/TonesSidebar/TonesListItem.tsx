import { useState } from "react"
import { observer } from 'mobx-react-lite'
import { Collapse, Grid, Typography } from "@mui/material"
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

// entities
import { ITone, ToneStore, TToneId, TToneIdState } from "@/entities/Tone"

export interface ITonesListItemProps {
  tone: ITone
}

export const TonesListItem = observer(({ tone }: ITonesListItemProps) => {
  const currentToneId: TToneIdState = ToneStore.tones.currentToneId
  const toneActive = tone.id === currentToneId

  const [isShown, setIsShown] = useState<boolean>(false)
  const handleChangeCurrentToneId = (toneId: TToneId) => {
    if (currentToneId && toneId === currentToneId) {
      ToneStore.clearCurrentToneId()
    } else {
      ToneStore.setCurrentToneId(toneId)
    }
  }

  return (
    <Grid
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
})
