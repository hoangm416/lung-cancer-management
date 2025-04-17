import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { Record } from '@/types';

type EditRecordFormProps = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues: Record;
    onSubmit: (data: Record) => void;
};

const EditRecordForm = ({ isOpen, onClose, defaultValues, onSubmit }: EditRecordFormProps) => {
    const form = useForm<Record>({
      defaultValues,
    });

    // Reset form values when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);
  
    const handleSubmit = (data: Record) => {
      onSubmit(data);
      form.reset();
      onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-screen overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-center text-2xl text-primary">
                    Chỉnh sửa bản ghi y tế
                </DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="case_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã hồ sơ</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập mã hồ sơ" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="case_submitter_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã mẫu bệnh phẩm</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập mã mẫu bệnh phẩm" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="project_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại ung thư</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập loại ung thư" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="patient_name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Họ và tên bệnh nhân</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập họ và tên bệnh nhân" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="age_at_index"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tuổi hiện tại</FormLabel>
                            <FormControl>
                            <Input {...field} 
                                type="number" 
                                placeholder="Nhập tuổi" 
                                onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="days_to_birth"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số ngày đến ngày sinh</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập số ngày (giá trị âm)" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    /> */}
                    <FormField
                        control={form.control}
                        name="days_to_death"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số ngày đến khi tử vong</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập số ngày (giá trị dương)" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
    
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập giới tính" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vital_status"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tình trạng</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Còn sống/Đã mất" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year_of_birth"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Năm sinh</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập năm sinh" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year_of_death"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Năm mất</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập năm mất" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
    
                    <FormField
                        control={form.control}
                        name="ajcc_pathologic_m"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>M (di căn xa) theo AJCC</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ajcc_pathologic_n"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>N (hạch bạch huyết vùng) theo AJCC</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ajcc_pathologic_stage"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giai đoạn bệnh theo AJCC</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ajcc_pathologic_t"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>T (khối u nguyên phát) theo AJCC</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ajcc_staging_system_edition"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phiên bản hệ thống AJCC sử dụng</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
    
                    {/* Cột 2 */}
                    <div className="space-y-4">       
                    <FormField
                        control={form.control}
                        name="classification_of_tumor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phân loại khối u</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập phân loại khối u" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icd_10_code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã bệnh theo ICD-10</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_known_disease_status"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tình trạng bệnh gần nhất được biết</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="morphology"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hình thái học</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="primary_diagnosis"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chẩn đoán chính</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="prior_malignancy"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Có tiền sử ung thư không</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
    
                    <FormField
                        control={form.control}
                        name="prior_treatment"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Đã từng điều trị chưa</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="progression_or_recurrence"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tiến triển hoặc tái phát</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="site_of_resection_or_biopsy"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vị trí phẫu thuật hoặc sinh thiết</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
    
                    <FormField
                        control={form.control}
                        name="synchronous_malignancy"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Có khối u ác tính đồng thời không</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tissue_or_organ_of_origin"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô hoặc cơ quan phát sinh khối u</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tumor_grade"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Độ ác tính của khối u</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
    
                    <FormField
                        control={form.control}
                        name="year_of_diagnosis"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ngày/năm chẩn đoán</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập ngày hoặc năm" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )} 
                    />
                    <FormField
                        control={form.control}
                        name="treatment_or_therapy"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Điều trị hoặc liệu pháp chưa?</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="treatment_type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại điều trị</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </div>
                <DialogFooter className="flex justify-center">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit">Cập nhật</Button>
                </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditRecordForm;