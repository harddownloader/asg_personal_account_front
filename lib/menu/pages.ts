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
          id: 'my_profile',
          title: 'Мои профиль',
          type: 'item',
          icon: icons.IconUserCircle,
          url: '/profile',
          target: false,
      },
      {
        id: 'my_cargos',
        title: 'Мои грузы',
        type: 'item',
        icon: icons.IconBoxSeam,
        url: '/',
        target: false,
      },
    ]
}

export default pages
