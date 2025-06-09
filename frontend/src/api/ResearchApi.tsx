import { useQuery, useMutation, useQueryClient } from "react-query";
import { Research } from "@/types";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllResearches = () => {
  const getResearchesRequest = async (): Promise<Research[]> => {

    const response = await fetch(`${API_BASE_URL}/api/research`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Lấy thông tin thất bại");
    }

    const result = await response.json();
    return result.data; // Trả về mảng Research[]
  };

  const { data: researches = [], isLoading } = useQuery<Research[]>(
    "fetchResearches",
    getResearchesRequest
  );

  return { researches, isLoading };
};

export const useGetResearchById = (id: string) => {
  const getResearchRequest = async (): Promise<Research> => {
    const response = await fetch(`${API_BASE_URL}/api/research/${id}`);
    if (!response.ok) {
      throw new Error("Không tìm thấy nghiên cứu");
    }
    return response.json();
  };

  const { data: research, isLoading } = useQuery(
    ["fetchResearch", id],
    getResearchRequest
  );

  return { research, isLoading };
};

export const useSearchResearch = (query: string) => {
  const searchResearchesRequest = async (): Promise<Research[]> => {
    const response = await fetch(`${API_BASE_URL}/api/research/search?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Lấy thông tin thất bại");
    }

    const result = await response.json();
    return result.data; // Trả về mảng Research[]
  };

  const { data: researches = [], isLoading, isError, error } = useQuery<Research[]>(
    ["searchResearches", query],
    searchResearchesRequest,
    {
      enabled: query.length > 0, // Chỉ gọi API khi có query
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(`Lỗi khi tìm kiếm: ${err.message}`);
        } else {
          toast.error("Đã xảy ra lỗi không xác định.");
        }
      },
    }
  );  

  return { researches, isLoading, isError, error };
};

export const useAddResearch = () => {
  const queryClient = useQueryClient();

  const addResearchRequest = async (newResearch: Research): Promise<Research> => {

    const response = await fetch(`${API_BASE_URL}/api/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newResearch),
    });

    if (!response.ok) {
      throw new Error("Thêm Research thất bại");
    }

    return response.json();
  };

  return useMutation(addResearchRequest, {
    onSuccess: () => {
      toast.success("Thêm bài báo thành công!"); // Hiển thị thông báo thành công
      queryClient.invalidateQueries("fetchResearches"); // Làm mới danh sách Research
    },
    onError: (error: Error) => {
      toast.error(`Thêm bài báo thất bại: ${error.message}`); // Hiển thị thông báo lỗi
    },
  });
};

export const useEditResearch = () => {
  const queryClient = useQueryClient();

  const editResearchRequest = async ({
    _id,
    updatedResearch,
  }: {
    _id: string,
    research_id?: string;
    updatedResearch: Research;
  }): Promise<Research> => {

    const response = await fetch(`${API_BASE_URL}/api/research/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedResearch),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Sửa Research thất bại");
    }

    return result.research;
  };

  return useMutation(editResearchRequest, {
    onSuccess: () => {
      toast.success("Sửa nghiên cứu thành công!");
      queryClient.invalidateQueries("fetchResearches");
    },
    onError: (error: Error) => {
      toast.error(`Sửa nghiên cứu thất bại: ${error.message}`);
    },
  });
};

export const useDeleteResearch = () => {
  const queryClient = useQueryClient();

  const deleteResearchRequest = async (_id: string): Promise<void> => {

    const response = await fetch(`${API_BASE_URL}/api/research/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Xóa Research thất bại");
    }
  };

  return useMutation(deleteResearchRequest, {
    onSuccess: () => {
      toast.success("Xóa nghiên cứu thành công!");
      queryClient.invalidateQueries("fetchResearches");
    },
    onError: (error: Error) => {
      toast.error(`Xóa nghiên cứu thất bại: ${error.message}`);
    },
  });
};