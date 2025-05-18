import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Kiểu chung cho 1 bản ghi omics
export type OmicsRecord = Record<string, any>;

// Kiểu response backend trả về
interface OmicsResponse {
  type: string;
  count: number;
  data: OmicsRecord[];
}

export const useGetOmics = (type: string, id?: string) => {
  const fetchFn = async (): Promise<OmicsRecord[]> => {
    const url = id
      ? `${API_BASE_URL}/api/analytics/${type}/${encodeURIComponent(id)}`
      : `${API_BASE_URL}/api/analytics/${type}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json" 
      },
    });

    if (!response.ok) {
      throw new Error(`Lấy dữ liệu tiền xử lý thất bại: ${response.status}`);
    }

    // console.log("Type:", type);
    // console.log("ID:", id);

    const result: OmicsResponse = await response.json();
    return result.data;
  };

  // useQuery với key phụ thuộc vào type + id
  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useQuery<OmicsRecord[], Error>(
    ["omics", type, id ?? "all"],
    fetchFn,
    {
      // tuỳ chọn: chỉ fetch khi có type
      enabled: !!type,
      // staleTime, cacheTime… có thể config thêm ở đây
    }
  );

  return { records, isLoading, isError, error };
};
