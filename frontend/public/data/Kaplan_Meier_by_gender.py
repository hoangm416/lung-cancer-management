import pandas as pd
from lifelines import KaplanMeierFitter
import matplotlib.pyplot as plt
import logging

logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

def load_data():
    # Chỉ load survival + demographic data, giả sử chung 1 file
    survival_data = pd.read_csv("../../data/survival.tsv", sep="\t")
    clinical_data = pd.read_csv("../../data/TCGA-LUAD.clinical.tsv", sep="\t")

    merged_data = pd.merge(survival_data, clinical_data[['sample', 'gender.demographic']], on='sample', how='inner')
    
    return merged_data

def plot_km_by_gender():
    data = load_data()
    logger.info(f"Loaded data with shape: {data.shape}")
    logger.info(f"Columns: {data.columns.tolist()}")

    # Kiểm tra dữ liệu giới tính
    print(data['gender.demographic'].value_counts())

    kmf = KaplanMeierFitter()

    plt.figure(figsize=(8,6))
    for gender in data['gender.demographic'].unique():
        group = data[data['gender.demographic'] == gender]

        kmf.fit(group['OS.time'], event_observed=group['OS'], label=str(gender))
        kmf.plot()

    plt.title("Kaplan-Meier Curve by Gender")
    plt.xlabel("Time (OS.time)")
    plt.ylabel("Survival Probability")
    plt.legend(title="Gender")
    plt.tight_layout()
    plt.xlim(left=0)
    plt.ylim(bottom=0)

    plt.savefig("public/plots/kaplan_meier_by_gender.png")
    plt.show()

if __name__ == "__main__":
    plot_km_by_gender()
