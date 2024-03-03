export const NOTIFICATION_AUDIO_CLASSNAME = "notificationAudio"
export const NOTIFICATION_AUDIO_FILE_PATH = "/audio/notification.mp3"

export const notificationAudioPlay = () => {
  const audio: HTMLAudioElement | null = document.getElementById(NOTIFICATION_AUDIO_CLASSNAME) as HTMLAudioElement
  if (audio) audio.play()
}
