import { SuccessResponse } from 'src/types/ultis.type'
import { User } from 'src/types/user.type'
import http from 'src/utils/https'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

export const userApi = {
  getProfile: () => http.get<SuccessResponse<User>>('/me'),
  updateProfile: (body: BodyUpdateProfile) => http.put<SuccessResponse<User>>('/user', body),
  uploadAvatar: (body: FormData) =>
    http.post('/user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
