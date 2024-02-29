import { ITone } from '@/entities/Tone'

export const TONE_ENTITY: ITone = {
  _id: "_id",
  'label': "label",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
} as const

export const TONES_DB_COLLECTION_NAME: string = 'tones' as const
