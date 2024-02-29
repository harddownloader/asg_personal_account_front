import { ReactNode } from 'react'

// mui
import { CardContent } from '@mui/material'
import MainCard from '@/shared/ui/cards/MainCard'

// project components
import SkeletonPopularCard from '@/shared/ui/cards/Skeleton/PopularCard'

export interface ScrollableBlockProps {
  isLoading: boolean
  children: ReactNode
  overContent?: ReactNode
  underContent?: ReactNode
  isScrollable: boolean
  style?: React.CSSProperties
}

export const ScrollableBlock = ({
  isLoading,
  children,
  overContent = null,
  underContent = null,
  isScrollable,
  style
}: ScrollableBlockProps) => {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <>
          {overContent}
          <MainCard content={false} isHeightFull isScrollable={isScrollable} style={style}>
            <CardContent>{children}</CardContent>
          </MainCard>
          {underContent}
        </>
      )}
    </>
  )
}

export default ScrollableBlock
