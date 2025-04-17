import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { Research } from "@/types";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const useGetAllResearches = () => {
//   const getAllResearchesRequest = async (): Promise<Research[]> => {
//     const response = await fetch(`${API_BASE_URL}/api/research`);
//     if (!response.ok) {
//       throw new Error("Lấy danh sách nghiên cứu thất bại");
//     }
//     return response.json();
//   };

//   const { data: researches, isLoading } = useQuery(
//     "fetchAllResearches",
//     getAllResearchesRequest
//   );

//   return { researches, isLoading };
// };

// export const useAddResearch = () => {
//   const { getAccessTokenSilently } = useAuth0();

//   const addResearchRequest = async (researchData: Partial<Research>) => {
//     const accessToken = await getAccessTokenSilently();

//     const response = await fetch(`${API_BASE_URL}/api/research`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(researchData),
//     });

//     if (!response.ok) {
//       throw new Error("Tạo nghiên cứu thất bại");
//     }
//     return response.json();
//   };

//   const {
//     mutate: addResearch,
//     isLoading,
//     isSuccess,
//     error,
//   } = useMutation(addResearchRequest);

//   if (isSuccess) toast.success("Tạo nghiên cứu thành công");
//   if (error) toast.error("Tạo nghiên cứu thất bại");

//   return { addResearch, isLoading };
// };

// export const useEditResearch = () => {
//   const { getAccessTokenSilently } = useAuth0();

//   const editResearchRequest = async ({ id, data }: { id: string; data: Partial<Research> }) => {
//     const accessToken = await getAccessTokenSilently();

//     const response = await fetch(`${API_BASE_URL}/api/research/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error("Cập nhật nghiên cứu thất bại");
//     }
//     return response.json();
//   };

//   const {
//     mutate: editResearch,
//     isLoading,
//     isSuccess,
//     error,
//   } = useMutation(editResearchRequest);

//   if (isSuccess) toast.success("Cập nhật nghiên cứu thành công");
//   if (error) toast.error("Không thể cập nhật nghiên cứu");

//   return { editResearch, isLoading };
// };

// export const useDeleteResearch = () => {
//   const { getAccessTokenSilently } = useAuth0();

//   const deleteResearchRequest = async (id: string) => {
//     const accessToken = await getAccessTokenSilently();

//     const response = await fetch(`${API_BASE_URL}/api/research/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Xoá nghiên cứu thất bại");
//     }
//     return response.json();
//   };

//   const {
//     mutate: deleteResearch,
//     isLoading,
//     isSuccess,
//     error,
//   } = useMutation(deleteResearchRequest);

//   if (isSuccess) toast.success("Xoá nghiên cứu thành công");
//   if (error) toast.error("Không thể xoá nghiên cứu");

//   return { deleteResearch, isLoading };
// };

export const useGetAllResearches = () => {
  const { getAccessTokenSilently } = useAuth0(); // Lấy accessToken từ Auth0

  const getResearchesRequest = async (): Promise<Research[]> => {
    const accessToken = await getAccessTokenSilently(); // Lấy accessToken

    const response = await fetch(`${API_BASE_URL}/api/research`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
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

export const useAddResearch = () => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0(); // Lấy accessToken từ Auth0

  const addResearchRequest = async (newResearch: Research): Promise<Research> => {
    const accessToken = await getAccessTokenSilently(); // Lấy accessToken

    const response = await fetch(`${API_BASE_URL}/api/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
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
      toast.success("Thêm nghiên cứu thành công!"); // Hiển thị thông báo thành công
      queryClient.invalidateQueries("fetchResearches"); // Làm mới danh sách Research
    },
    onError: (error: Error) => {
      toast.error(`Thêm nghiên cứu thất bại: ${error.message}`); // Hiển thị thông báo lỗi
    },
  });
};

export const useEditResearch = () => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  const editResearchRequest = async ({
    _id,
    submitter_id,
    updatedResearch,
  }: {
    _id: string,
    submitter_id?: string;
    updatedResearch: Research;
  }): Promise<Research> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/research/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
  const { getAccessTokenSilently } = useAuth0();

  const deleteResearchRequest = async (_id: string): Promise<void> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/research/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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