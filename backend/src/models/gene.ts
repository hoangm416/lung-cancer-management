import { Schema, model, Document } from "mongoose";

// 1. Định nghĩa interface cho TypeScript
export interface IGene extends Document {
  Ensembl_ID: string;
  [key: string]: any;
}

// 2. Tạo schema, chỉ khai báo Ensembl_ID
const GeneSchema = new Schema<IGene>(
  {
    Ensembl_ID: { type: String, required: true },
  },
  {
    collection: "gene",   // tên collection trong Mongo
    strict: false,        // cho phép lưu các field không khai báo trong schema
    timestamps: false,    // nếu không cần createdAt/updatedAt thì tắt
  }
);

// 3. Xuất model
const Gene = model<IGene>("Gene", GeneSchema);
export default Gene;
