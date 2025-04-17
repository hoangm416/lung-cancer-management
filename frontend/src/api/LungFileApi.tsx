import { useQuery, useMutation, useQueryClient } from "react-query";
import { FileType, FileData } from "@/types";
import { toast } from "sonner"; // Import thư viện toast để hiển thị thông báo

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.CLOUDINARY_UPLOAD_PRESET;

// Lấy danh sách file
export const useFiles = (case_submitter_id: string) => {
  return useQuery<FileData[]>(
    ["files", case_submitter_id],
    async () => {
      const res = await fetch(`${API_BASE_URL}/api/multiomics/${case_submitter_id}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      return data.files;
    },
    {
      enabled: !!case_submitter_id,
      onError: (err: unknown) => {
        const error = err as Error;
        toast.error(`Lỗi khi lấy danh sách file: ${error.message}`);
      },
    }
  );
};

// Upload file lên Cloudinary
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { secure_url: string }, // Cloudinary trả về URL của file đã upload
    unknown,
    { case_submitter_id: string; file: File; fileType: FileType; fileName?: string }
  >(
    async ({ case_submitter_id, file, fileType, fileName }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Preset từ Cloudinary

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file to Cloudinary");
      const data = await res.json();

      // Lưu thông tin file vào backend (nếu cần)
      await fetch(`${API_BASE_URL}/api/multiomics/${case_submitter_id}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileType,
          fileName: fileName || data.original_filename,
          fileUrl: data.secure_url,
        }),
      });

      return data; // Trả về dữ liệu từ Cloudinary
    },
    {
      onSuccess: (_data, variables) => {
        toast.success("Upload file thành công!");
        queryClient.invalidateQueries(["files", variables.case_submitter_id]);
      },
      onError: (error: unknown) => {
        const err = error as Error;
        toast.error(`Lỗi khi upload file: ${err.message}`);
      },
    }
  );
};

// Đổi tên file
export const useRenameFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FileData,
    unknown,
    { case_submitter_id: string; fileType: FileType; newFileName: string }
  >(
    async ({ case_submitter_id, fileType, newFileName }) => {
      const res = await fetch(`${API_BASE_URL}/api/multiomics/rename`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ case_submitter_id, fileType, newFileName }),
      });

      if (!res.ok) throw new Error("Failed to rename file");
      const data = await res.json();
      return data.file;
    },
    {
      onSuccess: (_data, variables) => {
        toast.success("Đổi tên file thành công!");
        queryClient.invalidateQueries(["files", variables.case_submitter_id]);
      },
      onError: (error: unknown) => {
        const err = error as Error;
        toast.error(`Lỗi khi đổi tên file: ${err.message}`);
      },
    }
  );
};

// Xóa file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    unknown,
    { case_submitter_id: string; fileType: FileType }
  >(
    async ({ case_submitter_id, fileType }) => {
      const res = await fetch(`${API_BASE_URL}/api/multiomics/delete/${case_submitter_id}/${fileType}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");
    },
    {
      onSuccess: (_data, variables) => {
        toast.success("Xóa file thành công!");
        queryClient.invalidateQueries(["files", variables.case_submitter_id]);
      },
      onError: (error: unknown) => {
        const err = error as Error;
        toast.error(`Lỗi khi xóa file: ${err.message}`);
      },
    }
  );
};