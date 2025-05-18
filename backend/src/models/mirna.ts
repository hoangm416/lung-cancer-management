import { Schema, model, Document } from "mongoose";

// 1. Định nghĩa interface cho TypeScript
export interface IRna extends Document {
  miRNA_ID: string;
  [key: string]: any;
}

// 2. Tạo schema, chỉ khai báo Ensembl_ID
const RnaSchema = new Schema<IRna>(
  {
    miRNA_ID: { type: String, required: true },
  },
  {
    collection: "mirna",   // tên collection trong Mongo
    strict: false,        // cho phép lưu các field không khai báo trong schema
    timestamps: false,    // nếu không cần createdAt/updatedAt thì tắt
  }
);

// 3. Xuất model
const Rna = model<IRna>("Rna", RnaSchema);
export default Rna;
