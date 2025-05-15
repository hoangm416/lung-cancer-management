// import Papa from 'papaparse';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Input } from './ui/input';
import { BaseTable } from './BaseTable';
import { z } from 'zod';
import { Button } from './ui/button';
import { OmicsRecord, useGetOmics } from '@/api/AnalyticsApi';

const rangeSchema = z.object({
  start: z.number().min(1, "Dòng bắt đầu phải lớn hơn hoặc bằng 1"),
    end: z.number(),
  }).superRefine((values, ctx) => {
    if (values.end <= values.start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dòng kết thúc phải lớn hơn dòng bắt đầu",
        path: ["end"],
      });
    }
});

const DnaAnalytics = () => {
  const { records: data, isLoading, isError, error } = useGetOmics("dna");

  // 2. State cho filter và table
  const [columns, setColumns] = useState<{ accessorKey: string; header: string }[]>([]);
  const [startRow, setStartRow] = useState(1);
  const [endRow, setEndRow]     = useState(10);
  const [filtered, setFiltered] = useState<OmicsRecord[]>([]);

  // 3. Khi data load xong, set filtered = data & sinh columns
  useEffect(() => {
    if (data.length > 0) {
      setFiltered(data);
      const cols = Object.keys(data[0]).map((k) => ({
        accessorKey: k,
        header: k,
      }));
      setColumns(cols);
    }
  }, [data]);

  // 4. Handler lọc theo range
  const handleFilter = () => {
    try {
      rangeSchema.parse({ start: startRow, end: endRow });
      setFiltered(data.slice(startRow - 1, endRow));
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu gene…</div>;
  if (isError)   return <div>Lỗi: {error?.message}</div>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-10 items-center mb-4">
        {/* FormControl để nhập dòng bắt đầu và dòng kết thúc */}
        <div className="flex items-center gap-4">
          {/* Nhóm Từ */}
          <div className="flex items-center space-x-1">
            <label htmlFor="startRow" className="text-sm font-medium">Từ</label>
            <Input
              id="startRow"
              type="number"
              value={startRow}
              onChange={(e) => setStartRow(Number(e.target.value))}
              className="w-24"
            />
          </div>

          {/* Nhóm Đến */}
          <div className="flex items-center space-x-1">
            <label htmlFor="endRow" className="text-sm font-medium">Đến</label>
            <Input
              id="endRow"
              type="number"
              value={endRow}
              onChange={(e) => setEndRow(Number(e.target.value))}
              className="w-24"
            />
          </div>

          {/* Button Lọc */}
          <Button
            onClick={handleFilter}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Lọc
          </Button>
        </div>

      </div>

      {filtered.length > 0 ? (
        <BaseTable
          data={filtered}
          columns={columns}
          setOffset={() => {}}
          isPreviousData={false}
          isLoading={false}
          rowSelection={{}}
          setRowSelection={() => {}}
        />
      ) : (
        <div>Không có dữ liệu để hiển thị</div>
      )}
    </div>
  );
};

export default DnaAnalytics;