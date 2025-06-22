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
      role: "user"
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
  }
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

    const token = jwt.sign (
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    // Đăng nhập thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Đã xảy ra lỗi",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, job, phone, idcard } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
      return;
    }

    user.name = name;
    user.job = job;
    user.phone = phone;
    user.idcard = idcard;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi cập nhật hồ sơ" });
  }
};

export default {
  createUser,
  loginUser,
  getUser,
  updateUser
}

