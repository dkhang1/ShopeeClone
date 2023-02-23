const saveAccessTokenToLocal = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
const clearAccesTokenFromLocal = () => {
  localStorage.removeItem('access_token')
}
const getAccessTokenFromLocal = () => localStorage.getItem('access_token') || ''

export { saveAccessTokenToLocal, clearAccesTokenFromLocal, getAccessTokenFromLocal }
