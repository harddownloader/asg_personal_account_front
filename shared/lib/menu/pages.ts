// assets
import { IconBoxSeam, IconUserCircle } from '@tabler/icons-react'
import { pagesPath } from '../$path'

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Меню',
    caption: '',
    type: 'group',
    children: [
      {
        id: 'user_profile',
        title: 'Мои профиль',
        type: 'collapse',
        icon: IconUserCircle,
        url: pagesPath.user_profile.$url().pathname,
        children: [
          {
            id: 'profile',
            title: 'Контактная информация',
            type: 'item',
            url: pagesPath.profile.$url().pathname,
            target: false
          },
          {
            id: 'security',
            title: 'Безопастность',
            type: 'item',
            url: pagesPath.security.$url().pathname,
            target: false
          }
        ]
      },
      {
        id: 'cargos',
        title: 'Мои грузы',
        type: 'item',
        icon: IconBoxSeam,
        url: pagesPath.home.$url().pathname,
        target: false,
      },
    ]
}

export default pages
