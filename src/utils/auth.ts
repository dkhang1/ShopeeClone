import { User } from 'src/types/user.type'

const saveAccessTokenToLocal = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
const clearLocal = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}
const getAccessTokenFromLocal = () => localStorage.getItem('access_token') || ''

const getProfileFromLocal = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

const saveProfileToLocal = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export { saveAccessTokenToLocal, clearLocal, getAccessTokenFromLocal, getProfileFromLocal, saveProfileToLocal }
