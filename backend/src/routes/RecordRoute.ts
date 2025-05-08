import express from "express";
import RecordController from "../controllers/RecordController";
// import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", RecordController.getRecord); // Lấy danh sách Record
router.post("/", RecordController.addRecord); // Thêm Record
router.put("/:id", RecordController.editRecord); // Sửa Record
router.delete("/:id", RecordController.removeRecord); // Xóa Record
router.get("/search", RecordController.searchRecord); // Tìm kiếm Record

export default router;