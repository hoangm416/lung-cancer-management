import { useQuery, useMutation, useQueryClient } from "react-query";
// import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0
import { Record } from "@/types";
import { toast } from "sonner"; // Import thư viện toast

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRecord = () => {
  // const { getAccessTokenSilently } = useAuth0(); // Lấy accessToken từ Auth0

  const getRecordsRequest = async (): Promise<Record[]> => {
    // const accessToken = await getAccessTokenSilently(); // Lấy accessToken

    const response = await fetch(`${API_BASE_URL}/api/record`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
      },
    });

    if (!response.ok) {
      throw new Error("Lấy thông tin thất bại");
    }

    const result = await response.json();
    return result.data; // Trả về mảng Record[]
  };

  const { data: records = [], isLoading } = useQuery<Record[]>(
    "fetchRecords",
    getRecordsRequest
  );

  return { records, isLoading };
};

export const useAddRecord = () => {
  const queryClient = useQueryClient();
  // const { getAccessTokenSilently } = useAuth0(); // Lấy accessToken từ Auth0

  const addRecordRequest = async (newRecord: Record): Promise<Record> => {
    // const accessToken = await getAccessTokenSilently(); // Lấy accessToken

    const response = await fetch(`${API_BASE_URL}/api/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
      },
      body: JSON.stringify(newRecord),
    });

    if (!response.ok) {
      throw new Error("Thêm bản ghi thất bại");
    }

    return response.json();
  };

  return useMutation(addRecordRequest, {
    onSuccess: () => {
      toast.success("Thêm bản ghi thành công!"); // Hiển thị thông báo thành công
      queryClient.invalidateQueries("fetchRecords"); // Làm mới danh sách Record
    },
    onError: (error: Error) => {
      toast.error(`Thêm bản ghi thất bại: ${error.message}`); // Hiển thị thông báo lỗi
    },
  });
};

export const useEditRecord = () => {
  const queryClient = useQueryClient();
  // const { getAccessTokenSilently } = useAuth0();

  const editRecordRequest = async ({
    case_submitter_id,
    updatedRecord,
  }: {
    case_submitter_id?: string;
    updatedRecord: Record;
  }): Promise<Record> => {
    // const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/record/${case_submitter_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedRecord),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Sửa bản ghi thất bại");
    }

    return result.record;
  };

  return useMutation(editRecordRequest, {
    onSuccess: () => {
      toast.success("Sửa bản ghi thành công!");
      queryClient.invalidateQueries("fetchRecords");
    },
    onError: (error: Error) => {
      toast.error(`Sửa bản ghi thất bại: ${error.message}`);
    },
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();
  // const { getAccessTokenSilently } = useAuth0();

  const deleteRecordRequest = async (case_submitter_id: string): Promise<void> => {
    // const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/record/${case_submitter_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Xóa bản ghi thất bại");
    }
  };

  return useMutation(deleteRecordRequest, {
    onSuccess: () => {
      toast.success("Xóa bản ghi thành công!");
      queryClient.invalidateQueries("fetchRecords");
    },
    onError: (error: Error) => {
      toast.error(`Xóa bản ghi thất bại: ${error.message}`);
    },
  });
};
