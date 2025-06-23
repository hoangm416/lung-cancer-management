import express from "express";
import RecordController from "../controllers/RecordController";
import { jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", RecordController.getRecord); // Lấy danh sách Record
router.post("/", jwtParse, RecordController.addRecord); // Thêm Record
router.put("/:id", jwtParse, RecordController.editRecord); // Sửa Record
router.delete("/:id", jwtParse, RecordController.removeRecord); // Xóa Record
router.get("/search", RecordController.searchRecord); // Tìm kiếm Record

export default router;