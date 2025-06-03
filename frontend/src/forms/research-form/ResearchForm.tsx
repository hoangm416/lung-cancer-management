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
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type ResearchFormProps = {
  isOpen: boolean;
  onClose: () => void;
  buttonText?: string;
  onSubmit: (data: Research) => void;
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

const ResearchForm = ({
  isOpen,
  onClose,
  buttonText = "Lưu",
  onSubmit,
}: ResearchFormProps) => {
  const form = useForm<Research>({
    defaultValues: {
      date: today,
    },
  });

  const [uploading, setUploading] = useState(false);

  // Hàm upload ảnh lên Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const researchId = form.getValues("research_id");
      if (!researchId) {
        alert("Vui lòng nhập mã nghiên cứu trước khi chọn ảnh!");
        setUploading(false);
        return;
      }
      const filePath = `${researchId}/${file.name}`;
      const { error } = await supabase.storage.from("research").upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from("research").getPublicUrl(filePath);
      if (data?.publicUrl) {
        form.setValue("image", data.publicUrl);
      }
    } catch (err) {
      alert("Lỗi upload ảnh!");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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
            Thêm bài báo khoa học
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
                      <FormLabel>Mã bài báo</FormLabel>
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
                            <SelectItem value="popular" className="cursor-pointer hover:bg-hover">
                              Khoa học thường thức
                            </SelectItem>
                            <SelectItem value="specialize" className="cursor-pointer hover:bg-hover">
                              Khoa học chuyên sâu
                            </SelectItem>
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
                        <Input
                          {...field}
                          value={field.value ? (typeof field.value === "string" ? field.value : (field.value as Date).toISOString().slice(0, 10)) : ""}
                          type="date"
                          disabled
                          required
                        />
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
                        <>
                          <Input
                            {...field}
                            placeholder="Đường dẫn ảnh minh họa"
                            readOnly
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="mt-2"
                          />
                          {uploading && <span className="text-xs text-gray-500">Đang tải ảnh...</span>}
                          {field.value && (
                            <img src={field.value} alt="preview" className="mt-2 max-h-32 rounded" />
                          )}
                        </>
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
