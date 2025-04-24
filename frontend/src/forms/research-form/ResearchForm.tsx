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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Research } from '@/types';

type ResearchFormProps = {
  isOpen: boolean;
  onClose: () => void;
  buttonText?: string;
  onSubmit: (data: Research) => void;
};

const ResearchForm = ({
  isOpen,
  onClose,
  buttonText = "Lưu",
  onSubmit,
}: ResearchFormProps) => {
  const form = useForm<Research>({
    defaultValues: {},
  });

  const handleSubmit = (data: Research) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary">
            Thêm bài nghiên cứu
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="research_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nghiên cứu</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập mã bài nghiên cứu" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại bài nghiên cứu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="popular">Khoa học thường thức</SelectItem>
                            <SelectItem value="specialize">Khoa học chuyên sâu</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề bài nghiên cứu" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày đăng</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập ngày đăng bài nghiên cứu" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhóm tác giả</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Nhập nhóm tác giả"
                          required
                          rows={5}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đường dẫn</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập đường dẫn đến bài viết gốc" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập mô tả ngắn" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh minh họa</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập ảnh minh họa" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi tiết</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Nhập chi tiết bài nghiên cứu"
                          required
                          rows={20}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
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
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResearchForm;
