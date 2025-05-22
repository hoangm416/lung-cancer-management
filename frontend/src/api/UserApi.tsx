import { User } from "@/types";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateUser = () => {
  const registerUserRequest = async (user: User) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Đăng ký thất bại");
    }
    return response.json();
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(registerUserRequest, {
    onSuccess: (data) => {
      toast.success(data.message || "Đăng ký thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Đăng ký thất bại");
    },
  });

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};