import pandas as pd
from lifelines import KaplanMeierFitter
import matplotlib.pyplot as plt
import logging

# Thiết lập logger
logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

# Danh sách các giai đoạn cần phân tích
VALID_STAGES = ["IA", "IB", "IIA", "IIB", "IIIA", "IIIB", "IV"]

# Hàm dùng để sắp xếp thứ tự giai đoạn
def stage_order(stage):
    order = {s: i for i, s in enumerate(VALID_STAGES)}
    return order.get(stage, len(order))  # Unknown stages xếp sau cùng


def load_data():
    # Đọc dữ liệu survival và clinical
    survival_data = pd.read_csv("../../data/survival.tsv", sep="\t")
    clinical_data = pd.read_csv("../../data/TCGA-LUAD.clinical.tsv", sep="\t")

    stage_col = "ajcc_pathologic_stage.diagnoses"
    if stage_col not in clinical_data.columns:
        raise ValueError(f"Không tìm thấy cột '{stage_col}' trong clinical.tsv")

    # Gộp dữ liệu
    merged = pd.merge(
        survival_data,
        clinical_data[["sample", stage_col]],
        on="sample",
        how="inner"
    )

    # Làm sạch dữ liệu giai đoạn
    merged[stage_col] = (
        merged[stage_col]
        .astype(str)
        .str.upper()
        .str.strip()
        .str.replace("STAGE ", "")  # Loại bỏ "STAGE IA" -> "IA"
        .str.replace("STAGE", "")   # Loại bỏ "STAGEIB" -> "IB"
    )

    # Lọc các giá trị hợp lệ
    merged = merged[merged[stage_col].isin(VALID_STAGES)]
    return merged, stage_col


def plot_km_by_ajcc_stage():
    df, stage_col = load_data()
    logger.info(f"Dữ liệu sau lọc giai đoạn: {df.shape}")
    logger.info(df[stage_col].value_counts())

    kmf = KaplanMeierFitter()
    plt.figure(figsize=(10, 7))

    for stage in sorted(df[stage_col].unique(), key=stage_order):
        stage_data = df[df[stage_col] == stage]
        kmf.fit(stage_data["OS.time"], event_observed=stage_data["OS"], label=stage)
        kmf.plot()

    plt.title("Kaplan-Meier Curve by AJCC Pathologic Stage")
    plt.xlabel("Time (OS.time)")
    plt.ylabel("Survival Probability")
    plt.legend(title="AJCC Stage")
    plt.tight_layout()
    plt.xlim(left=0)
    plt.ylim(bottom=0)
    plt.savefig("public/plots/kaplan_meier_by_ajcc_stage.png")
    plt.show()


if __name__ == "__main__":
    plot_km_by_ajcc_stage()
