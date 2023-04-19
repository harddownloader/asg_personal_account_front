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
        id: 'user_profile',
        title: 'Мои профиль',
        type: 'collapse',
        icon: IconUserCircle,
        url: '/user_profile',
        children: [
          {
            id: 'profile',
            title: 'Контактная информация',
            type: 'item',
            url: '/user_profile/profile',
            target: false
          },
          {
            id: 'security',
            title: 'Безопастность',
            type: 'item',
            url: '/user_profile/security',
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
