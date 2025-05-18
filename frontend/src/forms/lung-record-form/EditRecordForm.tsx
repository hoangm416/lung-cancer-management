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
                        name="patient_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mã bệnh nhân</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập mã bệnh nhân" required />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="sample_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mã mẫu bệnh phẩm</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nhập mã mẫu bệnh phẩm" required />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="diagnosis_age"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tuổi lúc chẩn đoán</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="biopsy_site"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Vị trí sinh thiết</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="cancer_type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Loại ung thư</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="disease_free_months"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Số tháng không bệnh (sau điều trị)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="disease_free_status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tình trạng không bệnh</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="disease_type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Loại bệnh</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="ethnicity_category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Dân tộc</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="fraction_genome_altered"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tỷ lệ bộ gen bị biến đổi</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="icd_10_classification"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phân loại theo mã ICD-10</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="is_ffpe"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Có phải mẫu FFPE không?</FormLabel>
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
                            <FormLabel>Mô học (hình thái tế bào/bệnh lý học)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="mutation_count"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Số lượng đột biến</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="overall_survival_months"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Số tháng sống sót tổng thể</FormLabel>
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
                        name="ajcc_pathologic_m"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mô tả di căn xa (M) theo AJCC</FormLabel>
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
                            <FormLabel>Mô tả hạch (N) theo AJCC</FormLabel>
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
                            <FormLabel>Giai đoạn bệnh lý theo AJCC</FormLabel>
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
                            <FormLabel>Mô tả khối u (T) theo AJCC</FormLabel>
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
                        name="primary_tumor_site"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Vị trí khối u chính</FormLabel>
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
                            <FormLabel>Có tiền sử ung thư ác tính trước đó</FormLabel>
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
                            <FormLabel>Đã từng điều trị trước đó</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="sample_type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Loại mẫu</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="years_smoked"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Số năm hút thuốc</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="cigarette_smoking_history_pack_year"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Lịch sử hút thuốc tính theo “gói-năm”</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
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
                            <FormLabel>Tình trạng sống</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="" />
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
                            <FormLabel>Năm được chẩn đoán</FormLabel>
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