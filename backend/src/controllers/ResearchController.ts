import { Request, Response } from "express";
import Research from "../models/research";
import slugify from "slugify";
import { toSlug } from "../utils/toSlug";

const getResearchById = async (req: Request, res: Response): Promise<void> => {
    try {
        const research = await Research.findById(req.params.id);
        if (!research) {
            res.status(404).json({ message: "Nghiên cứu không tồn tại" });
            return;
        }
        res.json(research);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const getAllResearches = async (req: Request, res: Response): Promise<void> => {
    try {
        const researches = await Research.find();
        res.json(researches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const createResearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const newResearch = new Research(req.body);
        await newResearch.save();
        res.status(201).json(newResearch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const updateResearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, ...rest } = req.body;

        const updateData: any = {
            ...rest,
        };

        // Nếu có trường 'title' thì cập nhật 'slug'
        if (title) {
            updateData.title = title;
            // updateData.slug = slugify(title, { lower: true, strict: true });
            updateData.slug = toSlug(title);
        }

        const updatedResearch = await Research.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedResearch) {
            res.status(404).json({ message: "Nghiên cứu không tồn tại" });
            return;
        }

        res.json(updatedResearch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const deleteResearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedResearch = await Research.findByIdAndDelete(req.params.id);
        if (!deletedResearch) {
            res.status(404).json({ message: "Nghiên cứu không tồn tại" });
            return;
        }
        res.json({ message: "Đã xóa nghiên cứu thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const getResearchBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const research = await Research.findOne({ slug: req.params.slug });
        if (!research) {
            res.status(404).json({ message: "Không tìm thấy bài nghiên cứu!" });
            return;
        }
        res.json(research);
    } catch (error) {
        console.error("Lỗi khi lấy bài nghiên cứu theo slug:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const searchResearches = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search_key } = req.query;

        const regex = search_key
            ? { detail: { $regex: search_key, $options: 'i' } } // 'i' không phân biệt hoa thường
            : {};

        const researches = await Research.find(regex);

        if (researches.length === 0) {
            res.status(404).json({ message: "❌ Không tìm thấy bài nghiên cứu!" });
            return;
        }

        res.json(researches);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm bài nghiên cứu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export default {
    getResearchById,
    getAllResearches,
    getResearchBySlug,
    createResearch,
    updateResearch,
    deleteResearch,
    searchResearches,
};
