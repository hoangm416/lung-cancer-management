import { Request, Response } from "express";
import Record from "../models/record";
import mongoose from "mongoose";

// Lấy danh sách Record
const getRecord = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().lean();
    res.json({ data: records });
  } catch (error: any) {
    console.error("Lỗi lấy dữ liệu:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Thêm Record mới
const addRecord = async (req: Request, res: Response) => {
  try {
    const {
      patient_id,
      sample_id,
      diagnosis_age,
      biopsy_site,
      cancer_type,
      disease_free_months,
      disease_free_status,
      disease_type,
      ethnicity_category,
      fraction_genome_altered,
      icd_10_classification,
      is_ffpe,
      morphology,
      mutation_count,
      overall_survival_months,
      ajcc_pathologic_m,
      ajcc_pathologic_n,
      ajcc_pathologic_stage,
      ajcc_pathologic_t,
      primary_diagnosis,
      primary_tumor_site,
      prior_malignancy,
      prior_treatment,
      sample_type,
      sex,
      years_smoked,
      cigarette_smoking_history_pack_year,
      vital_status,
      year_of_death,
      year_of_diagnosis
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!patient_id || !sample_id) {
      res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      return;
    }

    const newRecord = new Record({
      patient_id,
      sample_id,
      diagnosis_age,
      biopsy_site,
      cancer_type,
      disease_free_months,
      disease_free_status,
      disease_type,
      ethnicity_category,
      fraction_genome_altered,
      icd_10_classification,
      is_ffpe,
      morphology,
      mutation_count,
      overall_survival_months,
      ajcc_pathologic_m,
      ajcc_pathologic_n,
      ajcc_pathologic_stage,
      ajcc_pathologic_t,
      primary_diagnosis,
      primary_tumor_site,
      prior_malignancy,
      prior_treatment,
      sample_type,
      sex,
      years_smoked,
      cigarette_smoking_history_pack_year,
      vital_status,
      year_of_death,
      year_of_diagnosis
    });

    await newRecord.save();
    res.status(201).json({ message: "Record đã được thêm thành công", record: newRecord });
  } catch (error: any) {
    console.error("Lỗi thêm Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

const editRecord = async (req: Request, res: Response) => {
  try {
    const { id: sample_id } = req.params; 
    const updateData = req.body;

    // Tìm và cập nhật Record 
    const record = await Record.findOneAndUpdate({ sample_id }, updateData, { new: true });
    if (!record) {
      res.status(404).json({ message: "Không tìm thấy Record" });
      return;
    }

    res.status(200).json({ message: "Record đã được cập nhật thành công", record });
  } catch (error: any) {
    console.error("Lỗi sửa Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Xóa Record
const removeRecord = async (req: Request, res: Response) => {
  try {
    const { id: sample_id } = req.params; 

    // Tìm và xóa Record 
    const record = await Record.findOneAndDelete({ sample_id });
    if (!record) {
      res.status(404).json({ message: "Không tìm thấy Record để xóa" });
      return;
    }

    res.status(200).json({ message: "Record đã được xóa thành công" });
  } catch (error: any) {
    console.error("Lỗi xóa Record:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

// Tìm kiếm Record
const searchRecord = async (req: Request, res: Response) => {
  try {
    const searchCriteria: any = {};

    // Lấy các tham số tìm kiếm từ query
    const { sample_id } = req.query;

    // Thêm các điều kiện tìm kiếm nếu có
    if (sample_id) {
      searchCriteria.sample_id = { $regex: sample_id, $options: 'i' };
    }

    // Tìm kiếm Record dựa trên các tiêu chí
    const records = await Record.find(searchCriteria).lean();

    if (records.length === 0) {
      res.status(404).json({ message: "Không tìm thấy bản ghi nào phù hợp" });
      return;
    }

    res.status(200).json({ data: records });
  } catch (error: any) {
    console.error("Lỗi tìm kiếm bản ghi:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ nội bộ" });
  }
};

export default {
  getRecord,
  addRecord,
  editRecord,
  removeRecord,
  searchRecord,
};