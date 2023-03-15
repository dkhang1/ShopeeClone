import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file?: File) => void
}

const MAX_UPLOAD_IMAGE = 1048576

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    ;(event.target as HTMLInputElement).value = ''
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal?.size >= MAX_UPLOAD_IMAGE || !fileFromLocal.type.includes('image'))) {
      toast.error('File không đúng định đạng hoặc quá kích thước theo quy định')
      return
    }
    onChange && onChange(fileFromLocal)
  }

  return (
    <Fragment>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={onInputClick}
      />
      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm '
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  )
}
