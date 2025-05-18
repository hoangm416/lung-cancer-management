import { Schema, model, Document, Model } from "mongoose";

// 1. Interface chung cho các loại omics
export interface IBaseOmics extends Document {
  [key: string]: any;
}

// 2. Hàm tạo schema đơn giản với strict: false
const makeSchema = (pk: string): Schema<IBaseOmics> =>
  new Schema(
    { [pk]: { type: String, required: true } },
    { strict: false, timestamps: false }
  );

// 3. Tạo các model tương ứng
export const Cnv     = model<IBaseOmics>("Cnv",     makeSchema("Ensembl_ID"), "cnv");
export const Dna     = model<IBaseOmics>("Dna",     makeSchema("Composite_Element_REF"), "dna");
export const Gene    = model<IBaseOmics>("Gene",    makeSchema("Ensembl_ID"),            "gene");
export const Mirna   = model<IBaseOmics>("Mirna",   makeSchema("miRNA_ID"),              "mirna");

// 4. Map chung để xử lý động
export const OmicsMap = {
  cnv:     { model: Cnv,     primaryKey: "Ensembl_ID" },
  dna:     { model: Dna,     primaryKey: "Composite_Element_REF" },
  gene:    { model: Gene,    primaryKey: "Ensembl_ID" },
  mirna:   { model: Mirna,   primaryKey: "miRNA_ID" },
};

// 5. Khai báo type OmicsType
export type OmicsType = keyof typeof OmicsMap;
