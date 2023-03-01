export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// Cú pháp '-?' sẽ loại bỏ undefined của key optional (đơn giản là chuyển từ cú pháp: ?: thành :)
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
