import {
  _CargosStore,
  _CargosListView,
  _CargosListPooling,
} from './store'

const rootStore = new _CargosStore()

// export stores
export const CargosStore = rootStore
export const CargosListView = new _CargosListView(rootStore)
export const CargosListPooling = new _CargosListPooling(rootStore, CargosListView)
