import { ITone } from '@/entities/Tone'

export const TONE_ENTITY: ITone = {
  id: "id",
  'label': "label",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
} as const

export const TONES_DB_COLLECTION_NAME: string = 'tones' as const
export const CURRENT_TONE_ID_DEFAULT = null
