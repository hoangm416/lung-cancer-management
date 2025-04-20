import { Button } from '@/components/ui/button';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { LucideMoveLeft } from 'lucide-react';
// import { useState } from 'react';
// import FileManagement from '@/components/FileManagement';

const RecordDetail = () => {
  const { sample_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record;  
  
  return (
    <div>
      <Button
        className="flex items-center gap-2 rounded-md leading-none"
        variant="ghost"
        size="default"
        onClick={() =>
          navigate('/record')
        }
      >
        <LucideMoveLeft className="h-6 w-8" />
        <span className="align-middle">Trở về</span>
      </Button>

      <div className="w-30 mt-4 grid grid-cols-2 gap-7 p-4">
        <div className="col-span-1 border-2">
          <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
            Thông tin lâm sàng 
          </p>
          <div className="my-auto mt-3 grid grid-cols-2 px-2 text-base font-normal">
            <span className="py-1.5">Mã hồ sơ</span>
            <span className="py-1.5 text-right">{record.case_id}</span>
            
            <span className="py-1.5">Mã mẫu bệnh phẩm</span>
            <span className="py-1.5 text-right">{sample_id}</span>

            <span className="py-1.5">Loại ung thư</span>
            <span className="break-all py-1.5 text-right">{record.project_id}</span>

            <span className="py-1.5">Họ và tên bệnh nhân</span>
            <span className="py-1.5 text-right">{record.patient_name}</span>

            <span className="py-1.5">Tuổi hiện tại</span>
            <span className="py-1.5 text-right">{record.age_at_index}</span>
            
            <span className="py-1.5">Số ngày đến ngày sinh</span>
            <span className="py-1.5 text-right">{record.days_to_birth}</span>

            <span className="py-1.5">Số ngày đến ngày tử vong</span>
            <span className="py-1.5 text-right">{record.days_to_death}</span>

            <span className="py-1.5">Giới tính</span>
            <span className="py-1.5 text-right">{record.gender}</span>

            <span className="py-1.5">Tình trạng</span>
            <span className="py-1.5 text-right">{record.vital_status}</span>

            <span className="py-1.5">Năm sinh</span>
            <span className="py-1.5 text-right">{record.year_of_birth}</span>

            <span className="py-1.5">Năm mất</span>
            <span className="py-1.5 text-right">{record.year_of_death}</span>

            <span className="py-1.5">M (di căn xa) theo AJCC</span>
            <span className="py-1.5 text-right">{record.ajcc_pathologic_m}</span>

            <span className="py-1.5">N (hạch bạch huyết vùng) theo AJCC</span>
            <span className="py-1.5 text-right">{record.ajcc_pathologic_n}</span>

            <span className="py-1.5">Giai đoạn bệnh theo AJCC</span>
            <span className="py-1.5 text-right">{record.ajcc_pathologic_stage}</span>

            <span className="py-1.5">T (khối u nguyên phát) theo AJCC</span>
            <span className="py-1.5 text-right">{record.ajcc_pathologic_t}</span>

            <span className="py-1.5">Phiên bản hệ thống AJCC sử dụng</span>
            <span className="py-1.5 text-right">{record.ajcc_staging_system_edition}</span>
          </div>
        </div>

        <div className="col-span-1 border-2">
          <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
            Thông tin lâm sàng
          </p>
          <div className="my-auto mt-3 grid grid-cols-2 px-2 text-base font-normal">
            <span className="py-1.5">Phân loại khối u</span>
            <span className="py-1.5 text-right">{record.classification_of_tumor}</span>
            
            <span className="py-1.5">Mã bệnh theo ICD-10</span>
            <span className="py-1.5 text-right">{record.icd_10_code}</span>

            <span className="py-1.5">Tình trạng bệnh gần nhất được biết</span>
            <span className="break-all py-1.5 text-right">{record.last_known_disease_status}</span>

            <span className="py-1.5">Hình thái học</span>
            <span className="py-1.5 text-right">{record.morphology}</span>

            <span className="py-1.5">Chẩn đoán chính</span>
            <span className="py-1.5 text-right">{record.primary_diagnosis}</span>
            
            <span className="py-1.5">Có tiền sử ung thư không</span>
            <span className="py-1.5 text-right">{record.prior_malignancy}</span>

            <span className="py-1.5">Đã từng điều trị chưa</span>
            <span className="py-1.5 text-right">{record.prior_treatment}</span>

            <span className="py-1.5">Tiến triển hoặc tái phát</span>
            <span className="py-1.5 text-right">{record.progression_or_recurrence}</span>

            <span className="py-1.5">Vị trí phẫu thuật hoặc sinh thiết</span>
            <span className="py-1.5 text-right">{record.site_of_resection_or_biopsy}</span>

            <span className="py-1.5">Có khối u ác tính đồng thời không</span>
            <span className="py-1.5 text-right">{record.synchronous_malignancy}</span>

            <span className="py-1.5">Mô hoặc cơ quan phát sinh khối u</span>
            <span className="py-1.5 text-right">{record.tissue_or_organ_of_origin}</span>

            <span className="py-1.5">Độ ác tính của khối u</span>
            <span className="py-1.5 text-right">{record.tumor_grade}</span>

            <span className="py-1.5">Ngày/năm chẩn đoán</span>
            <span className="py-1.5 text-right">{record.year_of_diagnosis}</span>

            <span className="py-1.5">Điều trị hoặc liệu pháp</span>
            <span className="py-1.5 text-right">{record.treatment_or_therapy}</span>

            <span className="py-1.5">Loại điều trị</span>
            <span className="py-1.5 text-right">{record.treatment_type}</span>

          </div>
        </div>
      </div>

      {/* <div className="mt-4 gap-7 p-4">
        <div className="col-span-1 border-2">
          <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
            Thông tin chuyên ngành 
          </p>
          <FileManagement case_submitter_id={record.case_submitter_id} />
        </div>

      </div> */}
    </div>
  );
};

export default RecordDetail;
