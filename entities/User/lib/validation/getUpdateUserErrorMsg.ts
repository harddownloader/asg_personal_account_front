export const getUpdateUserErrorMsg = (errorMessage: string) => {
  switch (errorMessage) {
    case 'auth/invalid-phone-number':
      return {
        field: 'phone',
        message: 'Не валидный телефон'
      }
    case 'auth/phone-number-already-exists':
      return {
        field: 'phone',
        message: 'Пользователь с таким телефоном уже существует'
      }
    case 'auth/invalid-display-name':
      return {
        field: 'name',
        message: 'Не валидное имя'
      }
    case 'auth/email-already-exists':
      return {
        field: 'email',
        message: 'Пользователь с таким email уже существует'
      }
    case 'auth/invalid-email':
      return {
        field: 'email',
        message: 'Не валидный email'
      }
    default:
      return {
        field: 'server',
        message: 'Что-то пошло не так... Обратитесь пожалуйста в поддержку'
      }
  }
}
