// assets
import { IconBoxSeam, IconUserCircle } from '@tabler/icons-react'

// constant
const icons = {
  IconBoxSeam,
  IconUserCircle
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Меню',
    caption: '',
    type: 'group',
    children: [
      {
        id: 'profile',
        title: 'Мои профиль',
        type: 'collapse',
        icon: icons.IconUserCircle,
        url: '/profile',
        children: [
          {
            id: 'profile_contacts',
            title: 'Контактная информация',
            type: 'item',
            url: '/profile/profile',
            target: false
          },
          {
            id: 'profile_security',
            title: 'Безопастность',
            type: 'item',
            url: '/profile/security',
            target: false
          }
        ]
      },
      {
        id: 'cargos',
        title: 'Мои грузы',
        type: 'item',
        icon: icons.IconBoxSeam,
        url: '/',
        target: false,
      },
    ]
}

export default pages
