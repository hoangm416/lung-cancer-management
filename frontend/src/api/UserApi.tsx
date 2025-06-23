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

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;     
  };
}

export const useLoginUser = () => {
  const loginUserRequest = async (user: User): Promise<LoginResponse> => {
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
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.user.role);
      sessionStorage.setItem("_id", data.user._id);
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

export const useGetMyUser = () => {
  const getMyUserRequest = async (): Promise<User> => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error("Thiếu token");

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Lấy thông tin người dùng thất bại");
    }
    return response.json();
  };

  const { data: currentUser, isLoading, error } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { currentUser, isLoading };
};

type UpdateMyUserRequest = {
  name: string;
  job: string;
  phone: string;
  idcard: string;
  hospital: string;
  department: string;
};

export const useUpdateMyUser = () => {
  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error("Thiếu token");

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Cập nhật thông tin thất bại");
    }

    return response.json();
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateMyUserRequest);

  if (isSuccess) {
    toast.success("Cập nhật thông tin thành công");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading };
};