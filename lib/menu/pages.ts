// assets
import { IconBoxSeam, IconUserCircle } from '@tabler/icons-react'

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
        icon: IconUserCircle,
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
        icon: IconBoxSeam,
        url: '/',
        target: false,
      },
    ]
}

export default pages
