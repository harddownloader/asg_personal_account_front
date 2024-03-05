import { useState } from "react"
import { Collapse, Grid, Typography } from "@mui/material"
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useTheme } from "@mui/material/styles"
import { observer } from 'mobx-react-lite'

// entities
import { ITone, ToneStore, TToneId, TToneIdState } from "@/entities/Tone"

// shared
import { ScrollableBlock } from "@/shared/ui/ScrollableBlock"
import { ICustomTheme } from '@/shared/lib/themes/theme'

// assets
import classes from './TonesSidebar.module.scss'
import { TonesListItem } from "@/widgets/Sidebar/TonesSidebar/TonesListItem"

export const TonesSidebar = observer(() => {
  const theme = useTheme<ICustomTheme>()

  const allTones: ITone[] = [...ToneStore.tones.items]

  return (
    <>
      <ScrollableBlock
        isLoading={false}
        isScrollable
        style={{
          minHeight: 'calc(77vh - 70px)',
          maxHeight: 'calc(77vh - 70px)',
          background: 'inherit',
        }}
        underBlockJSX={<Typography
          variant="caption"
          sx={{ ...theme.typography.menuCaption, paddingBottom: 0 }}
          display="block"
        >Список тонн</Typography>}
      >
        {allTones
          ? allTones.map((tone, index) => <TonesListItem tone={tone} key={index} />)
          : <p>Тонны не были загружены</p>
        }
      </ScrollableBlock>
    </>
  )
})

TonesSidebar.displayName = 'TonesSidebar'
