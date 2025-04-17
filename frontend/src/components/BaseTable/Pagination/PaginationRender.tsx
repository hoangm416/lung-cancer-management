import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownPageLimit } from './DropdownPageLimit'
import { TablePagination } from './TablePagination'

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

type PaginationRenderProps = {
  totalAttrs: number
  limitPagination: number
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  countLimitPaginationRef?: React.MutableRefObject<number>
  isPreviousData: boolean
  table?: any
  isAbsoluteBtn?: boolean
  setPageSize?: React.Dispatch<React.SetStateAction<number>>
  tableIndex: React.MutableRefObject<number>
  isSearchData?: boolean
}

export function PaginationRender({
  totalAttrs,
  limitPagination,
  offset,
  setOffset,
  isPreviousData,
  table,
  setPageSize,
  tableIndex,
  isSearchData,
}: PaginationRenderProps) {
  const { pageSize } = table.getState().pagination

  const [pageIndex, setPageIndex] = useState<number>(0)

  useEffect(() => {
    tableIndex.current = pageIndex
  }, [pageIndex, tableIndex])

  useEffect(() => {
    setPageIndex(0)
  }, [isSearchData])

  return (
    <div className="flex w-full flex-col justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {`Bản ghi ${pageIndex * pageSize > totalAttrs ? 1 : pageIndex * pageSize + 1}-${(pageIndex + 1) * pageSize > totalAttrs ? totalAttrs : (pageIndex + 1) * pageSize} 
        của ${totalAttrs} bản ghi`}
      </div>
      <div className="flex flex-row items-center gap-4 lg:gap-4">
        <DropdownPageLimit table={table} />
        {/* <div className="flex items-center">{t('table:pagination')}</div> */}
        <div className="flex w-[100px] items-center justify-center whitespace-nowrap text-sm text-muted-foreground">
          Bản ghi / trang
        </div>
        <div className="flex items-center space-x-4">
          <Button
            className="hidden h-8 w-8 px-[12px] py-[8px] lg:flex"
            onClick={() => {
              const offsetCalc =
                Math.floor(((pageIndex - 1) * pageSize) / limitPagination) *
                limitPagination
              setOffset?.(offsetCalc)
              setPageIndex(prev => prev - 1)
              setTimeout(() => {
                table.setPageIndex(pageIndex - offsetCalc / pageSize - 1)
              }, 1)
            }}
            disabled={pageIndex === 0 || isPreviousData}
            // variant="secondaryLight"
            variant="outline"
          >
            <LuChevronLeft className="h-4 w-4" />
          </Button>
          <TablePagination
            currentPage={pageIndex}
            totalCount={totalAttrs}
            pageSize={pageSize}
            table={table}
            setCurrentPage={setPageIndex}
            setOffset={setOffset}
            offset={offset}
            limit={limitPagination}
          />
          <Button
            className="hidden h-8 w-8 px-[12px] py-[8px] lg:flex"
            onClick={() => {
              const offsetCalc =
                Math.floor(((pageIndex + 1) * pageSize) / limitPagination) *
                limitPagination
              if (
                limitPagination < totalAttrs &&
                offsetCalc >= limitPagination
              ) {
                setOffset?.(offsetCalc)
              }
              setPageIndex(prev => prev + 1)
              table.setPageIndex(pageIndex + 1 - offsetCalc / pageSize)
            }}
            disabled={
              (pageIndex + 1) * pageSize >= totalAttrs || isPreviousData
            }
            variant="outline"
          >
            <LuChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
