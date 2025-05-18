const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  sample_id: { type: String, required: true },
  diagnosis_age: { type: String },
  biopsy_site: { type: String },
  cancer_type: { type: String },
  disease_free_months: { type: String },
  disease_free_status: { type: String },
  disease_type: { type: String },
  ethnicity_category: { type: String },
  fraction_genome_altered: { type: String },
  icd_10_classification: { type: String },
  is_ffpe: { type: String },
  morphology: { type: String },
  mutation_count: { type: String },
  overall_survival_months: { type: String },
  ajcc_pathologic_m: { type: String },
  ajcc_pathologic_n: { type: String },
  ajcc_pathologic_stage: { type: String },
  ajcc_pathologic_t: { type: String },
  primary_diagnosis: { type: String },
  primary_tumor_site: { type: String },
  prior_malignancy: { type: String },
  prior_treatment: { type: String },
  sample_type: { type: String },
  sex: { type: String },
  years_smoked: { type: String },
  cigarette_smoking_history_pack_year: { type: String },
  vital_status: { type: String },
  year_of_death: { type: String },
  year_of_diagnosis: { type: String }
});

const Record = mongoose.model('Record', recordSchema);
export default Record;
