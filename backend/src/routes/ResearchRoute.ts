import express from "express";
import { param } from "express-validator";
import ResearchController from "../controllers/ResearchController";
import Research from "../models/research";

const router = express.Router();

router.get("/search", async (req, res) => {
  const detail = req.query.detail as string;

  const query: any = {};
  if (detail) {
    query.detail = { $regex: detail, $options: "i" };
  }

  try {
    const results = await Research.find(query);
    if (results.length === 0) {
      res.status(404).json({ message: "❌ Không tìm thấy bài nghiên cứu!" });
      return;
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

router.get(
    "/:id",
    param("id")
        .isMongoId()
        .notEmpty()
        .withMessage("ID không hợp lệ"),
    ResearchController.getResearchById
);

router.get("/", ResearchController.getAllResearches);

router.get("/:type/:slug", ResearchController.getResearchBySlug);

router.post("/", ResearchController.createResearch);

router.put(
    "/:id",
    param("id")
        .isMongoId()
        .withMessage("ID không hợp lệ"),
    ResearchController.updateResearch
);

router.delete(
    "/:id",
    param("id")
        .isMongoId()
        .withMessage("ID không hợp lệ"),
    ResearchController.deleteResearch
);

export default router;
