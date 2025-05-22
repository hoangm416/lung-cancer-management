import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email đã tồn tại" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
  }

  console.log(req.body)
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
      res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
      return;
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      return;
    }

    // So khớp mật khẩu
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      return;
    }

    // Đăng nhập thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
  }
};

export default {
  createUser,
  loginUser,
}

