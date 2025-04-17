import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useEffect, useCallback, useRef } from 'react'
import * as z from 'zod'

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(state => !state), [])

  return { isOpen, open, close, toggle }
}

export const MAX_FILE_SIZE = 5000000
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const uploadImageSchema = z.object({
  file: z
    .instanceof(File, {
      message: "File is required",
    })
    .refine(
      file => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB",
    )
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "File type must be JPEG, JPG or PNG",
    ),
})
type UploadImage = {
  project_id: string
  file: z.infer<typeof uploadImageSchema>
}
export type UploadImageDTO = {
  data: UploadImage
}
export function useResetDefaultImage(defaultImage: string) {
  const avatarRef = useRef<HTMLImageElement>(null)
  const [uploadImageErr, setUploadImageErr] = useState('')

  const {
    control: controlUploadImage,
    setValue: setValueUploadImage,
    getValues: getValueUploadImage,
    formState: formStateUploadImage,
  } = useForm<UploadImageDTO['data']>({
    resolver: uploadImageSchema && zodResolver(uploadImageSchema),
  })

  function handleResetDefaultImage() {
    setUploadImageErr('')
    if (avatarRef.current != null) {
      avatarRef.current.src = defaultImage
    }
    fetch(defaultImage)
      .then(res => res.blob())
      .then(blob => {
        const defaultFile = new File([blob], 'default.png', blob)
        const formData = new FormData()
        formData.append('file', defaultFile)
        setValueUploadImage(
          'file',
          formData.get('file') as unknown as { file: File },
        )
      })
  }

  return {
    handleResetDefaultImage,
    avatarRef,
    uploadImageErr,
    setUploadImageErr,
    controlUploadImage,
    setValueUploadImage,
    getValueUploadImage,
    formStateUploadImage,
  }
}
