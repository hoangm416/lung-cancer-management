import pandas as pd
from lifelines import KaplanMeierFitter
import matplotlib.pyplot as plt
import logging

# Setup logger
logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

def load_data():
    survival_data = pd.read_csv("../../data/survival.tsv", sep="\t")
    clinical_data = pd.read_csv("../../data/TCGA-LUAD.clinical.tsv", sep="\t")

    if "age_at_index.demographic" in clinical_data.columns:
        age_col = "age_at_index.demographic"
    elif "age_at_diagnosis" in clinical_data.columns:
        age_col = "age_at_diagnosis"
    else:
        raise ValueError("Không tìm thấy cột tuổi phù hợp trong dữ liệu clinical")

    merged = pd.merge(
        survival_data,
        clinical_data[["sample", age_col]],
        on="sample",
        how="inner"
    )

    merged[age_col] = pd.to_numeric(merged[age_col], errors="coerce")
    merged = merged.dropna(subset=[age_col])  # Bỏ các dòng không có tuổi

    return merged, age_col

def assign_age_group(age):
    if age <= 15:
        return "0-15"
    elif age <= 24:
        return "16-24"
    elif age <= 44:
        return "25-44"
    elif age <= 60:
        return "45-60"
    else:
        return ">60"

def plot_km_by_age_group():
    df, age_col = load_data()
    logger.info(f"Loaded data with shape: {df.shape}")
    
    # Tạo cột phân nhóm theo tuổi
    df["age_group"] = df[age_col].apply(assign_age_group)

    logger.info(df["age_group"].value_counts())

    kmf = KaplanMeierFitter()
    plt.figure(figsize=(10, 7))

    for group in sorted(df["age_group"].unique()):
        group_data = df[df["age_group"] == group]
        kmf.fit(group_data["OS.time"], event_observed=group_data["OS"], label=group)
        kmf.plot()

    plt.title("Kaplan-Meier Curve by Age Group")
    plt.xlabel("Time (OS.time)")
    plt.ylabel("Survival Probability")
    plt.legend(title="Age Group")
    plt.tight_layout()
    plt.xlim(left=0)
    plt.ylim(bottom=0)
    plt.savefig("public/plots/kaplan_meier_by_age_group.png")
    plt.show()

if __name__ == "__main__":
    plot_km_by_age_group()
