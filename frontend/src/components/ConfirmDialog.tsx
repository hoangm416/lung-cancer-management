import { useRef, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogPortal, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

export type ConfirmDialogProps = {
  title: string
  body?: string | ReactNode
  icon?: 'danger' | 'info'
  close: () => void
  isOpen: boolean
  isLoading?: boolean
  handleSubmit: () => void
}

const ConfirmDialog = ({
  title,
  body = '',
  close,
  isOpen,
  handleSubmit,
}: ConfirmDialogProps) => {
  const cancelButtonRef = useRef(null)

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => !isOpen && close()}
        // initialFocus={cancelButtonRef}
        modal={true}
      >
        <div className="sm:flex sm:items-start">
          <DialogPortal>
            <DialogContent>
              <div className="mt-3 text-center ">
                <DialogTitle className="text-bold mb-6 text-xl">
                  {title}
                </DialogTitle>
                {body && (
                  <div className="mt-2">
                    <p className="text-body-base text-secondary-900">{body}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-24 border bg-black hover:bg-gray-500"
                  onClick={close}
                  ref={cancelButtonRef}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  className="w-24 bg-destructive hover:bg-red-500"
                  onClick={handleSubmit}
                >
                  Xác nhận
                </Button>
              </div>
            </DialogContent>
          </DialogPortal>
        </div>
      </Dialog>
    </>
  )
}

export default ConfirmDialog