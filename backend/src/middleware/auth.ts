import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Khai báo global để thêm các thuộc tính tùy chỉnh vào Request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

// Định nghĩa hàm jwtParse với kiểu rõ ràng
export const jwtParse = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  // Kiểm tra xem token có tồn tại và đúng định dạng không
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Không có token xác thực" });
    return; // Dừng hàm, nhưng không trả về giá trị
  }

  const token = authorization.split(" ")[1];

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Gán thông tin người dùng vào req
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // Chuyển sang middleware tiếp theo
    next();
  } catch (error) {
    // Gửi phản hồi lỗi nếu token không hợp lệ
    res.status(401).json({ message: "Token không hợp lệ" });
    return; 
  }
};