import React, { ReactNode } from "react"
import { NOTIFICATION_AUDIO_CLASSNAME, NOTIFICATION_AUDIO_FILE_PATH } from './notificationAudio'

export type AudioProviderProps = {
  children: ReactNode
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  return (
    <>
      { children }
      <audio id={NOTIFICATION_AUDIO_CLASSNAME}>
        <source src={NOTIFICATION_AUDIO_FILE_PATH} type="audio/mp3" />
      </audio>
    </>
  )
}
