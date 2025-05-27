import { Schema, model, Document } from "mongoose";

// 1. Định nghĩa interface cho TypeScript
export interface IDna extends Document {
  Composite_Element_REF: string;
  [key: string]: any;
}

// 2. Tạo schema, chỉ khai báo Ensembl_ID
const DnaSchema = new Schema<IDna>(
  {
    Composite_Element_REF: { type: String, required: true },
  },
  {
    collection: "dnameth",   // tên collection trong Mongo
    strict: false,        // cho phép lưu các field không khai báo trong schema
    timestamps: false,    // nếu không cần createdAt/updatedAt thì tắt
  }
);

// 3. Xuất model
const Dna = model<IDna>("Dna", DnaSchema);
export default Dna;
