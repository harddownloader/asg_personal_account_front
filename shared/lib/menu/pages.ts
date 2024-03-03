// assets
import { IconBoxSeam, IconUserCircle } from '@tabler/icons-react'
import { pagesPath } from '../$path'

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

export const PAGES_IDS = {
  PAGES: 'pages',
  USER_PROFILE: 'user_profile',
  PROFILE: 'profile',
  SECURITY: 'security',
  CARGOS: 'cargos'
}

const pages = {
  id: PAGES_IDS.PAGES,
  title: 'Меню',
  caption: '',
  type: 'group',
  children: [
    {
      id: PAGES_IDS.USER_PROFILE,
      title: 'Мои профиль',
      type: 'collapse',
      icon: IconUserCircle,
      url: pagesPath.user_profile.$url().pathname,
      children: [
        {
          id: PAGES_IDS.PROFILE,
          title: 'Контактная информация',
          type: 'item',
          url: pagesPath.profile.$url().pathname,
          target: false
        },
        {
          id: PAGES_IDS.SECURITY,
          title: 'Безопастность',
          type: 'item',
          url: pagesPath.security.$url().pathname,
          target: false
        }
      ]
    },
    {
      id: PAGES_IDS.CARGOS,
      title: 'Мои грузы',
      type: 'item',
      icon: IconBoxSeam,
      url: pagesPath.home.$url().pathname,
      target: false
    }
  ]
}

export default pages
