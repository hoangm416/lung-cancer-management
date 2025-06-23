import { Button } from '@/components/ui/button';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { LucideMoveLeft } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';
import Report from '@/pages/Report';
import TissueImage from '@/pages/TissueImage';
import MultiOmics from '@/pages/MultiOmics';
import ProcessedData from './ProcessedData';

const RecordDetail = () => {
  const { sample_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record;  

  // const props = useSupabaseUpload({
  //   bucketName: 'medical',
  //   path: `${sample_id}`,
  //   maxFiles: 100,
  //   maxFileSize: 1000 * 1000 * 20, // 20MB,
  // })

  const [, setSelectedTab] = useState('a')

  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue);
  }

  return (
    <div>
      <Tabs defaultValue='a'>
        <div className='flex'>
          <div className='ml-4 flex items-center'>
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
            <span className="ml-3 text-xl font-bold">{sample_id}</span>
          </div>

          <TabsList className='flex ml-auto mr-4 bg-white rounded-t-md shadow'>
            <TabsTrigger
              value="a"
              className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
              onClick={() => handleTabChange('a')}
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="b"
              className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
              onClick={() => handleTabChange('b')}
            >
              Báo cáo bệnh lý
            </TabsTrigger>
            <TabsTrigger
              value="c"
              className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
              onClick={() => handleTabChange('c')}
            >
              Ảnh khối u
            </TabsTrigger>
            <TabsTrigger
              value="d"
              className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
              onClick={() => handleTabChange('d')}
            >
              Dữ liệu thô
            </TabsTrigger>
            <TabsTrigger
              value="e"
              className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
              onClick={() => handleTabChange('e')}
            >
              Dữ liệu đã xử lý
            </TabsTrigger>
          </TabsList>
        </div>

        <div>
          <TabsContent value='a'>
            <div className="w-30 mt-2 grid grid-cols-2 gap-7 p-4">
              <div className="col-span-1 border-2">
                <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
                  Thông tin lâm sàng 
                </p>
                <div className="my-auto mt-3 grid grid-cols-2 px-2 text-base font-normal">
                  <span className="py-1.5">Mã bệnh nhân</span>
                  <span className="py-1.5 text-right">{record.patient_id}</span>
                  
                  <span className="py-1.5">Mã mẫu bệnh phẩm</span>
                  <span className="py-1.5 text-right">{sample_id}</span>

                  <span className="py-1.5">Tuổi lúc chẩn đoán</span>
                  <span className="break-all py-1.5 text-right">{record.diagnosis_age}</span>

                  <span className="py-1.5">Vị trí sinh thiết</span>
                  <span className="py-1.5 text-right">{record.biopsy_site}</span>

                  <span className="py-1.5">Loại ung thư</span>
                  <span className="py-1.5 text-right">{record.cancer_type}</span>
                  
                  <span className="py-1.5">Số tháng không bệnh (sau điều trị)</span>
                  <span className="py-1.5 text-right">{record.disease_free_months}</span>

                  <span className="py-1.5">Tình trạng không bệnh</span>
                  <span className="py-1.5 text-right">{record.disease_free_status}</span>

                  <span className="py-1.5">Loại bệnh</span>
                  <span className="py-1.5 text-right">{record.disease_type}</span>

                  <span className="py-1.5">Dân tộc</span>
                  <span className="py-1.5 text-right">{record.ethnicity_category}</span>

                  <span className="py-1.5">Tỷ lệ bộ gen bị biến đổi</span>
                  <span className="py-1.5 text-right">{record.fraction_genome_altered}</span>

                  <span className="py-1.5">Phân loại theo mã ICD-10</span>
                  <span className="py-1.5 text-right">{record.icd_10_classification}</span>

                  <span className="py-1.5">Có phải mẫu FFPE không?</span>
                  <span className="py-1.5 text-right">{record.is_ffpe}</span>

                  <span className="py-1.5">Mô học (hình thái tế bào/bệnh lý học)</span>
                  <span className="py-1.5 text-right">{record.morphology}</span>

                  <span className="py-1.5">Số lượng đột biến</span>
                  <span className="py-1.5 text-right">{record.mutation_count}</span>

                  <span className="py-1.5">Số tháng sống sót tổng thể</span>
                  <span className="py-1.5 text-right">{record.overall_survival_months}</span>
                </div>
              </div>

              <div className="col-span-1 border-2">
                <p className=" bg-[#F2F1F1] px-2 py-2 text-lg font-semibold">
                  Thông tin lâm sàng
                </p>
                <div className="my-auto mt-3 grid grid-cols-2 px-2 text-base font-normal">
                  <span className="py-1.5">Mô tả di căn xa (M) theo AJCC</span>
                  <span className="py-1.5 text-right">{record.ajcc_pathologic_m}</span>
                  
                  <span className="py-1.5">Mô tả hạch (N) theo AJCC</span>
                  <span className="py-1.5 text-right">{record.ajcc_pathologic_n}</span>

                  <span className="py-1.5">Giai đoạn bệnh lý theo AJCC</span>
                  <span className="break-all py-1.5 text-right">{record.ajcc_pathologic_stage}</span>

                  <span className="py-1.5">Mô tả khối u (T) theo AJCC</span>
                  <span className="py-1.5 text-right">{record.ajcc_pathologic_t}</span>

                  <span className="py-1.5">Chẩn đoán chính</span>
                  <span className="py-1.5 text-right">{record.primary_diagnosis}</span>
                  
                  <span className="py-1.5">Vị trí khối u chính</span>
                  <span className="py-1.5 text-right">{record.primary_tumor_site}</span>

                  <span className="py-1.5">Có tiền sử ung thư ác tính trước đó</span>
                  <span className="py-1.5 text-right">{record.prior_malignancy}</span>

                  <span className="py-1.5">Đã từng điều trị trước đó</span>
                  <span className="py-1.5 text-right">{record.prior_treatment}</span>

                  <span className="py-1.5">Loại mẫu</span>
                  <span className="py-1.5 text-right">{record.sample_type}</span>

                  <span className="py-1.5">Giới tính</span>
                  <span className="py-1.5 text-right">{record.sex}</span>

                  <span className="py-1.5">Số năm hút thuốc</span>
                  <span className="py-1.5 text-right">{record.years_smoked}</span>

                  <span className="py-1.5">Lịch sử hút thuốc tính theo "gói-năm"</span>
                  <span className="py-1.5 text-right">{record.cigarette_smoking_history_pack_year}</span>

                  <span className="py-1.5">Tình trạng sống</span>
                  <span className="py-1.5 text-right">{record.vital_status}</span>

                  <span className="py-1.5">Năm mất</span>
                  <span className="py-1.5 text-right">{record.year_of_death}</span>

                  <span className="py-1.5">Năm được chẩn đoán</span>
                  <span className="py-1.5 text-right">{record.year_of_diagnosis}</span>

                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='b'>
            <Report />
          </TabsContent>

          <TabsContent value='c'>
            <TissueImage />
          </TabsContent>
          <TabsContent value='d'>
            <MultiOmics />
          </TabsContent>

          <TabsContent value='e'>
            <ProcessedData />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RecordDetail;
