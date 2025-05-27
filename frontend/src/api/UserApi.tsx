import { User } from "@/types";
import { useMutation } from "react-query";
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
      toast.success(data.message || "Đăng nhập thành công");
    },
    onError: (error: Error) => {
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

export const useLoginUser = () => {
  const loginUserRequest = async (user: User) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    return data;
  };

  const {
    mutateAsync: loginUser,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(loginUserRequest, {
    onSuccess: (data) => {
      toast.success(data.message || "Đăng nhập thành công");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng nhập thất bại");
    },
  });

  return {
    loginUser,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};