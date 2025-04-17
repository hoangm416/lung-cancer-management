export type User = {
  _id: string;
  email: string;
  name: string;
  addressLine1: string;
  phone: string; // da sua
  idCard: string; // da sua
};

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl: string;
  lastUpdated: string;
};

export type OrderStatus =
  | "placed"
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

export type Order = {
  _id: string;
  restaurant: Restaurant;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    addressLine1: string;
    phone: string;
    email: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  restaurantId: string;
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type Record = {
  case_id: string;
  case_submitter_id: string;
  project_id: string;
  patient_name?: string;
  age_at_index?: number;
  days_to_birth?: string;
  days_to_death?: string;
  ethnicity?: string;
  gender?: string;
  race?: string;
  vital_status?: string;
  year_of_birth?: string;
  year_of_death?: string;
  age_at_diagnosis?: string;
  ajcc_pathologic_m?: string;
  ajcc_pathologic_n?: string;
  ajcc_pathologic_stage?: string;
  ajcc_pathologic_t?: string;
  ajcc_staging_system_edition?: string;
  classification_of_tumor?: string;
  days_to_diagnosis?: number;
  days_to_last_follow_up?: number;
  icd_10_code?: string;
  last_known_disease_status?: string;
  morphology?: string;
  primary_diagnosis?: string;
  prior_malignancy?: string;
  prior_treatment?: string;
  progression_or_recurrence?: string;
  site_of_resection_or_biopsy?: string;
  synchronous_malignancy?: string;
  tissue_or_organ_of_origin?: string;
  tumor_grade?: string;
  year_of_diagnosis?: string;
  treatment_or_therapy?: string;
  treatment_type?: string;
};

export type FileType =
  | "cnv"
  | "dna_methylation"
  | "miRNA"
  | "gene_expression";

export type FileData = {
  file_type: FileType;
  file_url: string;
  file_name?: string;
  uploaded_at?: string; // ISO string từ Date (nếu lấy từ API)
}

export type MultiOmics = {
  _id?: string; // MongoDB id nếu có
  case_submitter_id: string;
  files: FileData[];
}


export type Research = {
  _id: string;
  submitter_id: string;
  research_id: string;
  type: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  image: string;
  detail: string;
};
