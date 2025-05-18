import { Schema, model, Document } from "mongoose";

// 1. Định nghĩa interface cho TypeScript
export interface ICnv extends Document {
  Ensembl_ID: string;
  [key: string]: any;
}

// 2. Tạo schema, chỉ khai báo Ensembl_ID
const CnvSchema = new Schema<ICnv>(
  {
    Ensembl_ID: { type: String, required: true },
  },
  {
    collection: "cnv",   // tên collection trong Mongo
    strict: false,        // cho phép lưu các field không khai báo trong schema
    timestamps: false,    // nếu không cần createdAt/updatedAt thì tắt
  }
);

// 3. Xuất model
const Cnv = model<ICnv>("Cnv", CnvSchema);
export default Cnv;
