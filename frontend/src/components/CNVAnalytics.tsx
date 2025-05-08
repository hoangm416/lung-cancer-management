import Papa from 'papaparse';
import { useState } from 'react'
import { toast } from 'sonner';
import { Input } from './ui/input';
import { BaseTable } from './BaseTable';
import { z } from 'zod';
import { Button } from './ui/button';
// import { useTableContext } from '@/context/TableContext';

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

const CNVAnalytics = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<{ accessorKey: string; header: string }[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [startRow, setStartRow] = useState(1); // Dòng bắt đầu
  const [endRow, setEndRow] = useState(10); // Dòng kết thúc
  const [filteredData, setFilteredData] = useState<Record<string, any>[]>([]); // Dữ liệu đã lọc
  // const { data, setData, columns, setColumns } = useTableContext();

  // Hàm xử lý khi người dùng upload file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Vui lòng chọn file.");
      return;
    }

    Papa.parse(file, {
      delimiter: "\t", // Dấu phân cách là tab
      header: true, // Dùng hàng đầu tiên làm tiêu đề cột
      skipEmptyLines: true, // Bỏ qua các dòng trống nếu có
      complete: (results) => {
        const parsedData = results.data as Record<string, any>[]; // Dữ liệu từ file

        // Kiểm tra dữ liệu trống
        if (!parsedData || parsedData.length === 0) {
          toast.error("File không có dữ liệu hoặc không hợp lệ.");
          return;
        }

        // Tạo columns từ keys của object đầu tiên
        const firstRow = parsedData[0];
        const generatedColumns = Object.keys(firstRow as Record<string, any>).map((key) => ({
          accessorKey: key, // Key để truy cập dữ liệu
          header: key, // Tiêu đề cột
        }));

        if (generatedColumns.length > 0) {
          setColumns(generatedColumns);
          setData(parsedData);
          setFilteredData(parsedData); // Hiển thị tất cả dữ liệu mặc định
        } else {
          console.error("Không thể tạo cột từ dữ liệu.");
        }
      },
      error: (error) => {
        console.error("Lỗi khi đọc file:", error);
        toast.error("Lỗi khi đọc file: " + error.message);
      },
    });
  };

  const handleFilter = () => {
    try {
      // Kiểm tra điều kiện a < b bằng zod
      rangeSchema.parse({ start: startRow, end: endRow });
      setFilteredData(data.slice(startRow - 1, endRow)); // Lọc dữ liệu theo dòng
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-10 items-center mb-4">
        {/* Input chọn file */}
        <Input
          type="file"
          onChange={handleFileUpload}
          style={{ marginBottom: "20px" }}
        />

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

      {filteredData.length > 0 && (
        <BaseTable
          data={filteredData}               // Dữ liệu từ file
          columns={columns}         // Cột được tạo tự động
          setOffset={() => {}}      // Hàm giả lập cho setOffset
          isPreviousData={false}    // Không có dữ liệu trước đó
          isLoading={false}         // Không có trạng thái loading
          setRowSelection={setRowSelection} // Quản lý chọn hàng
          rowSelection={rowSelection}       // Trạng thái chọn hàng
        />
      )}
    </div>
  );
};

export default CNVAnalytics;