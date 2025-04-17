import { type MutableRefObject } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'

interface ButtonProps {
  refComponent?: MutableRefObject<HTMLElement> | MutableRefObject<null>
  rowSelection?: { [key: string]: boolean }
  formatExcel?: Array<{ [key: string]: unknown }>
  isLoading?: boolean
  fileNameExcel?: string
}

export function ExportTable({
  rowSelection = {},
  formatExcel = [],
  fileNameExcel = 'ExportedFile.xlsx',
}: ButtonProps) {
  const handleExcel = () => {
    /* create worksheet */
    const ws = XLSX.utils.json_to_sheet(formatExcel)
    /* create workbook and export */
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, fileNameExcel)
  }

  return (
    <div className="flex items-center gap-x-1">
      <Button
        className="border bg-white text-black hover:bg-hover"
        onClick={handleExcel}
      >
        {Object.keys(rowSelection).length > 0
          ? `Xuất Excel: ${Object.keys(rowSelection).length}`
          : "Xuất Excel"}
      </Button>
    </div>
  )
}
