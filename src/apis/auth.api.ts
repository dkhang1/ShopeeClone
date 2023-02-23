import http from 'src/utils/https'

export const registerAccount = (body: { email: string; password: string }) => http.post('/register', body)
export const loginAccount = (body: { email: string; password: string }) => http.post('/login', body)
export const logoutAccount = () => http.post('/logout')
