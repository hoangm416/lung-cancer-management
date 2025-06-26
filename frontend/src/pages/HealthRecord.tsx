import { useState, useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { BaseTable } from '@/components/BaseTable';
import { Button } from '@/components/ui/button';
import { LucidePlus, LucidePencil, LucideTrash, LucideSearch, LucideEye } from 'lucide-react';
import RecordForm from '@/forms/lung-record-form/RecordForm';
import EditRecordForm from '@/forms/lung-record-form/EditRecordForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useGetRecord, useAddRecord, useEditRecord, useDeleteRecord, useSearchRecord } from '@/api/LungRecordApi';
import { Record } from '@/types';
import { Input } from '@/components/ui/input';

const HealthRecord = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role") ?? "user";

  // State quản lý dialog và bản ghi được chọn
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  // API hooks
  const { records, isLoading } = useGetRecord();
  const { mutate: addRecord } = useAddRecord();
  const { mutate: editRecord } = useEditRecord();
  const { mutate: deleteRecord, isLoading: isDeleting } = useDeleteRecord();

  // Hàm mở/đóng dialog thêm
  const openAddDialog = () => {
    setSelectedRecord(null);
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setSelectedRecord(null);
    setIsAddDialogOpen(false);
  };

  // Hàm mở/đóng dialog chỉnh sửa
  const openEditDialog = (record: Record) => {
    setSelectedRecord(record);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedRecord(null);
    setIsEditDialogOpen(false);
  };

  // Hàm mở/đóng ConfirmDialog
  const openConfirmDialog = (record: Record) => {
    setSelectedRecord(record);
    setIsConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setSelectedRecord(null);
    setIsConfirmOpen(false);
  };

  // Hàm xử lý xóa bản ghi
  const handleDelete = () => {
    if (selectedRecord) {
      deleteRecord(selectedRecord.sample_id, {
        onSuccess: () => {
          // alert('Xóa bản ghi thành công!');
          closeConfirmDialog();
        },
        onError: (error) => {
          console.error('Lỗi khi xóa bản ghi:', error);
          // alert('Xóa bản ghi thất bại!');
        },
      });
    }
  };

  // Hàm xử lý click vào dòng
  const handleRowClick = (record: Record) => {
    navigate(`/record/${record.sample_id}`, { state: { record } });
  };

  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({});
  const { data: searchResults } = useSearchRecord(searchParams);

  // Hàm xử lý tìm kiếm
  const handleSearch = (searchKey: string) => {
    if (searchKey.trim() === "") {
      setSearchParams({}); // Xóa tham số tìm kiếm nếu input rỗng
    } else {
      setSearchParams({ sample_id: searchKey });
    }
  };

  const [offset, setOffset] = useState<number>(0);
  const [rowSelection, setRowSelection] = useState({});
  const rowSelectionKey = Object.keys(rowSelection);

  const formatExcel = records.reduce(
    (acc, curr, index) => {
      const isSelected =
      rowSelectionKey.length > 0
        ? rowSelectionKey.includes(index.toString()) : true;
        
      if (isSelected) {
        const temp = {
          "STT": index + 1,
          "Mã bệnh nhân": curr.patient_id,
          "Mã mẫu bệnh phẩm": curr.sample_id,
          "Tuổi lúc chẩn đoán": curr.diagnosis_age,
          "Vị trí sinh thiết": curr.biopsy_site,
          "Loại ung thư": curr.cancer_type,
          "Số tháng không bệnh (sau điều trị)": curr.disease_free_months,
          "Tình trạng không bệnh": curr.disease_free_status,
          "Loại bệnh": curr.disease_type,
          "Dân tộc": curr.ethnicity_category,
          "Tỷ lệ bộ gen bị biến đổi": curr.fraction_genome_altered,
          "Phân loại theo mã ICD-10": curr.icd_10_classification,
          "Có phải mẫu FFPE không?": curr.is_ffpe,
          "Mô học": curr.morphology,
          "Số lượng đột biến": curr.mutation_count,
          "Số tháng sống sót tổng thể": curr.overall_survival_months,
          "Mô tả di căn xa (M)": curr.ajcc_pathologic_m || "",
          "Mô tả hạch (N)": curr.ajcc_pathologic_n || "",
          "Giai đoạn bệnh lý": curr.ajcc_pathologic_stage || "",
          "Mô tả khối u (T)": curr.ajcc_pathologic_t || "",
          "Chẩn đoán chính": curr.primary_diagnosis,
          "Vị trí khối u chính": curr.primary_tumor_site,
          "Có tiền sử ung thư ác tính trước đó": curr.prior_malignancy,
          "Đã từng điều trị trước đó": curr.prior_treatment,
          "Loại mẫu": curr.sample_type,
          "Giới tính": curr.sex,
          "Số năm hút thuốc": curr.years_smoked,
          "Lịch sử hút thuốc": curr.cigarette_smoking_history_pack_year,
          "Tình trạng sống": curr.vital_status,
          "Năm mất": curr.year_of_death,
          "Năm được chẩn đoán": curr.year_of_diagnosis,
        };        
        acc.push(temp)
      }
      return acc
    },
    [] as Array<{ [key: string]: unknown }>,
  )

  // Cột của bảng
  const columnHelper = createColumnHelper<Record>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Record, any>[]>(
    () => [
      columnHelper.display({
        id: 'actions',
        header: () => <span>Hành động</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <LucideEye
              className="h-5 w-5 cursor-pointer text-green-500"
              onClick={() => handleRowClick(row.original)} 
            />
            {role === "admin" && (
              <>
                <LucidePencil
                  className="h-5 w-5 cursor-pointer text-blue-500"
                  onClick={(event) => {
                    event.stopPropagation();
                    openEditDialog(row.original);
                  }}
                />
                <LucideTrash
                  className="h-5 w-5 cursor-pointer text-red-500"
                  onClick={(event) => {
                    event.stopPropagation();
                    openConfirmDialog(row.original);
                  }}
                />
              </>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        id: 'stt',
        cell: info => info.row.index + 1,
        header: () => <span>STT</span>,
        footer: info => info.column.id,
      }),
      columnHelper.accessor('patient_id', {
        id: 'patient_id',
        header: () => <span>Mã bệnh nhân</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('cancer_type', {
        id: 'cancer_type',
        header: () => <span>Loại ung thư</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('sample_id', {
        id: 'sample_id',
        header: () => <span>Mã mẫu bệnh phẩm</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('diagnosis_age', {
        id: 'diagnosis_age',
        header: () => <span>Tuổi chẩn đoán</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('sex', {
        id: 'sex',
        header: () => <span>Giới tính</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('vital_status', {
        id: 'vital_status',
        header: () => <span>Tình trạng</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('ajcc_pathologic_stage', {
        id: 'ajcc_pathologic_stage',
        header: () => <span>Giai đoạn AJCC</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('biopsy_site', {
        id: 'biopsy_site',
        header: () => <span>Vị trí sinh thiết</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('primary_diagnosis', {
        id: 'primary_diagnosis',
        header: () => <span>Chẩn đoán chính</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('year_of_diagnosis', {
        id: 'year_of_diagnosis',
        header: () => <span>Năm chẩn đoán</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
    ],
    [columnHelper, role]
  );

  return (
    <div>
      <div className="flex flex-row items-start justify-between gap-[28px]">
        <span className="text-2xl font-medium">Bảng dữ liệu bệnh phẩm</span>
        <div className="relative">
          <LucideSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Nhập mã mẫu bệnh phẩm"
            className="w-64 border-border pl-10"
            onChange={(e) => handleSearch(e.target.value)} // Gọi hàm tìm kiếm khi nhập
          />
        </div>
        {/* <div className="relative">
          
        </div> */}
        {role === "admin" && (
          <Button
            className="flex items-center gap-2 border font-normal"
            onClick={openAddDialog}
          >
            <LucidePlus className="inline-block h-4 w-4" />
            Thêm bản ghi
          </Button>
        )}
      </div>

      <div className="mt-5 w-full">
        <BaseTable
          data={Object.keys(searchParams).length > 0 ? searchResults ?? [] : records ?? []}
          columns={columns}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          offset={offset}
          setOffset={setOffset}
          isPreviousData={false}
          isLoading={isLoading}
          formatExcel={formatExcel}
        />
      </div>

      {/* Dialog thêm bản ghi */}
      {role === "admin" && (
        <RecordForm
          isOpen={isAddDialogOpen}
          onClose={closeAddDialog}
          onSubmit={(data) => {
            addRecord(data, {
              onSuccess: () => {
                closeAddDialog();
              },
              onError: (error) => {
                console.error('Lỗi khi thêm bản ghi:', error);
              },
            });
          }}
        />
      )}
      

      {/* Dialog chỉnh sửa bản ghi */}
      {role === "admin" && (
        <EditRecordForm
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          defaultValues={selectedRecord ?? {} as Record}
          onSubmit={(data) => {
            editRecord(
              { sample_id: selectedRecord?.sample_id, updatedRecord: data },
              {
                onSuccess: () => {
                  // alert('Cập nhật bản ghi thành công!');
                  closeEditDialog();
                },
                onError: (error) => {
                  console.error('Lỗi khi cập nhật bản ghi:', error);
                },
              }
            );
          }}
        />
      )}
      

      {/* ConfirmDialog xóa bản ghi */}
      {role === "admin" && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          close={closeConfirmDialog}
          isLoading={isDeleting}
          handleSubmit={handleDelete}
          title="Xác nhận xóa"
          body={`Bạn có chắc chắn muốn xóa bản ghi: ${selectedRecord?.sample_id}?`}
        />
      )}
    </div>
  );
};

export default HealthRecord;