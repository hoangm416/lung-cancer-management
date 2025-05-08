import { useState, useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { BaseTable } from '@/components/BaseTable';
import { Button } from '@/components/ui/button';
import { LucidePlus, LucidePencil, LucideTrash, LucideSearch } from 'lucide-react';
import RecordForm from '@/forms/lung-record-form/RecordForm';
import EditRecordForm from '@/forms/lung-record-form/EditRecordForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useGetRecord, useAddRecord, useEditRecord, useDeleteRecord, useSearchRecord } from '@/api/LungRecordApi';
import { Record } from '@/types';
// import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const HealthRecord = () => {
  const navigate = useNavigate();

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
      deleteRecord(selectedRecord.case_submitter_id, {
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
    navigate(`/record/${record.case_submitter_id}`, { state: { record } });
  };

  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({});
  const { data: searchResults, isLoading: isSearching } = useSearchRecord(searchParams);

  // Hàm xử lý tìm kiếm
  const handleSearch = (searchKey: string) => {
    if (searchKey.trim() === "") {
      setSearchParams({}); // Xóa tham số tìm kiếm nếu input rỗng
    } else {
      setSearchParams({ case_submitter_id: searchKey });
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
          "Mã bệnh án": curr.case_id,
          "Mã mẫu bệnh phẩm": curr.case_submitter_id,
          "Mã dự án": curr.project_id,
          "Tên bệnh nhân": curr.patient_name || "",
          "Tuổi tại thời điểm chẩn đoán": curr.age_at_index ?? "",
          "Số ngày trước sinh": curr.days_to_birth ?? "",
          "Số ngày đến khi tử vong": curr.days_to_death ?? "",
          "Dân tộc": curr.ethnicity || "",
          "Giới tính": curr.gender || "",
          "Chủng tộc": curr.race || "",
          "Tình trạng sống": curr.vital_status || "",
          "Năm sinh": curr.year_of_birth || "",
          "Năm tử vong": curr.year_of_death || "",
          "Tuổi khi được chẩn đoán": curr.age_at_diagnosis || "",
          "M-TNM": curr.ajcc_pathologic_m || "",
          "N-TNM": curr.ajcc_pathologic_n || "",
          "Giai đoạn bệnh (AJCC)": curr.ajcc_pathologic_stage || "",
          "T-TNM": curr.ajcc_pathologic_t || "",
          "Phiên bản hệ AJCC": curr.ajcc_staging_system_edition || "",
          "Phân loại khối u": curr.classification_of_tumor || "",
          "Số ngày đến khi chẩn đoán": curr.days_to_diagnosis ?? "",
          "Số ngày đến lần theo dõi gần nhất": curr.days_to_last_follow_up ?? "",
          "Mã ICD-10": curr.icd_10_code || "",
          "Tình trạng bệnh cuối cùng": curr.last_known_disease_status || "",
          "Loại mô học": curr.morphology || "",
          "Chẩn đoán chính": curr.primary_diagnosis || "",
          "Tiền sử ung thư trước đó": curr.prior_malignancy || "",
          "Tiền sử điều trị trước đó": curr.prior_treatment || "",
          "Tái phát hoặc tiến triển": curr.progression_or_recurrence || "",
          "Vị trí sinh thiết": curr.site_of_resection_or_biopsy || "",
          "Tình trạng ung thư đồng thời": curr.synchronous_malignancy || "",
          "Tổ chức hoặc cơ quan xuất phát": curr.tissue_or_organ_of_origin || "",
          "Mức độ biệt hóa khối u": curr.tumor_grade || "",
          "Năm chẩn đoán": curr.year_of_diagnosis || "",
          "Có điều trị/hoặc liệu pháp": curr.treatment_or_therapy || "",
          "Loại điều trị": curr.treatment_type || "",
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
          </div>
        ),
      }),
      columnHelper.display({
        id: 'stt',
        cell: info => info.row.index + 1,
        header: () => <span>STT</span>,
        footer: info => info.column.id,
      }),
      columnHelper.accessor('patient_name', {
        id: 'patient_name',
        header: () => <span>Tên bệnh nhân</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('project_id', {
        id: 'project_id',
        header: () => <span>Loại ung thư</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('case_submitter_id', {
        id: 'case_submitter_id',
        header: () => <span>Mã mẫu bệnh phẩm</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('age_at_index', {
        id: 'age_at_index',
        header: () => <span>Tuổi</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('gender', {
        id: 'gender',
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
      columnHelper.accessor('tumor_grade', {
        id: 'tumor_grade',
        header: () => <span>Độ biệt hóa</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('treatment_or_therapy', {
        id: 'treatment_or_therapy',
        header: () => <span>Đã điều trị?</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
      columnHelper.accessor('treatment_type', {
        id: 'treatment_type',
        header: () => <span>Hình thức điều trị</span>,
        cell: info => info.getValue() ?? 'N/A',
        footer: info => info.column.id,
      }),
    ],
    [columnHelper]
  );

  return (
    <div>
      <div className="flex flex-row items-start justify-between gap-[28px]">
        <span className="text-2xl font-medium text-text">Bảng dữ liệu bệnh phẩm</span>
        <div className="relative">
          <LucideSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Nhập mã mẫu bệnh phẩm"
            className="w-64 border-border pl-10"
            onChange={(e) => handleSearch(e.target.value)} // Gọi hàm tìm kiếm khi nhập
          />
        </div>
        <Button
          className="flex items-center gap-2 border font-normal"
          onClick={openAddDialog}
        >
          <LucidePlus className="inline-block h-4 w-4" />
          Thêm bản ghi
        </Button>
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
          onRowClick={handleRowClick}
        />
      </div>

      {/* Dialog thêm bản ghi */}
      <RecordForm
        isOpen={isAddDialogOpen}
        onClose={closeAddDialog}
        onSubmit={(data) => {
          addRecord(data, {
            onSuccess: () => {
              closeAddDialog();
            },
            onError: () => {
              alert('Thêm bản ghi thất bại!');
            },
          });
        }}
      />

      {/* Dialog chỉnh sửa bản ghi */}
      <EditRecordForm
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        defaultValues={selectedRecord ?? {} as Record}
        onSubmit={(data) => {
          editRecord(
            { case_submitter_id: selectedRecord?.case_submitter_id, updatedRecord: data },
            {
              onSuccess: () => {
                // alert('Cập nhật bản ghi thành công!');
                closeEditDialog();
              },
              onError: (error) => {
                console.error('Lỗi khi cập nhật bản ghi:', error);
                // alert('Cập nhật bản ghi thất bại!');
              },
            }
          );
        }}
      />

      {/* ConfirmDialog xóa bản ghi */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        close={closeConfirmDialog}
        isLoading={isDeleting}
        handleSubmit={handleDelete}
        title="Xác nhận xóa"
        body={`Bạn có chắc chắn muốn xóa bản ghi: ${selectedRecord?.case_submitter_id}?`}
      />
    </div>
  );
};

export default HealthRecord;