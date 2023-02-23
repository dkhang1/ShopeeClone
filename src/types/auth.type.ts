import { SuccessResponse } from './ultis.type'
import { User } from './user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
