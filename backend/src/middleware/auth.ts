import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Lấy userId và email từ token
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // Có thể kiểm tra user tồn tại trong DB nếu muốn
    // const user = await User.findById(decoded.userId);
    // if (!user) return res.status(401).json({ message: "User không tồn tại" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};