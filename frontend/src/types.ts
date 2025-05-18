export type Record = {
  patient_id: string, 
  sample_id: string,  
  diagnosis_age?: string,
  biopsy_site?: string,
  cancer_type?: string,
  disease_free_months?: string,
  disease_free_status?: string,
  disease_type?: string,
  ethnicity_category?: string,
  fraction_genome_altered?: string,
  icd_10_classification?: string,
  is_ffpe?: string,
  morphology?: string,
  mutation_count?: string,
  overall_survival_months?: string,
  ajcc_pathologic_m?: string,
  ajcc_pathologic_n?: string,
  ajcc_pathologic_stage?: string,
  ajcc_pathologic_t?: string,
  primary_diagnosis?: string,
  primary_tumor_site?: string,
  prior_malignancy?: string,
  prior_treatment?: string,
  sample_type?: string,
  sex?: string,
  years_smoked?: string,
  cigarette_smoking_history_pack_year?: string,
  vital_status?: string,
  year_of_death?: string,
  year_of_diagnosis?: string
};

// export type FileType =
//   | "cnv"
//   | "dna_methylation"
//   | "miRNA"
//   | "gene_expression";

// export type FileData = {
//   file_type: FileType;
//   file_url: string;
//   file_name?: string;
//   uploaded_at?: string; // ISO string từ Date (nếu lấy từ API)
// }

// export type MultiOmics = {
//   _id?: string; // MongoDB id nếu có
//   case_submitter_id: string;
//   files: FileData[];
// }

export type Research = {
  _id: string;
  submitter_id: string;
  research_id: string;
  type: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  link: string;
  description: string;
  image: string;
  detail: string;
};
