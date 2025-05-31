from lifelines.datasets import load_rossi
import pandas as pd
import numpy as np
from lifelines import CoxPHFitter
import matplotlib.pyplot as plt
import logging

# Create a logger
logging.basicConfig(format="%(asctime)s %(levelname)s: %(message)s")
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

def load_data():
    # Load the survival data
    survival_data = pd.read_csv("../../data/survival.tsv", sep="\t")

    # Load the omics data
    omics_cnv = pd.read_csv("../../data/cnv.clean.tsv", sep="\t", index_col=0)
    omics_dnameth = pd.read_csv("../../data/dnameth.clean.tsv", sep="\t", index_col=0)
    omics_mrna = pd.read_csv("../../data/mrna.clean.tsv", sep="\t", index_col=0)
    omics_mirna = pd.read_csv("../../data/mirna.clean.tsv", sep="\t", index_col=0)

    # Merge the omics data
    # multi_omics_data = pd.concat(
    #     [omics_cnv, omics_dnameth, omics_mrna, omics_mirna], axis=1
    # )

    return omics_mirna, survival_data

def run():
    multi_omics_data, survival_data = load_data()
    
    # Merge the omics data with the survival data (matching patient IDs)
    merged_data = pd.merge(
        multi_omics_data.T,
        survival_data[["sample", "OS.time", "OS"]],
        left_index=True,
        right_on="sample",
        how="inner",
    )

    logger.info(f"Merged data shape: {merged_data.shape}")

    logger.info(merged_data["sample"])
    
    # Drop non-numeric columns
    merged_data = merged_data.drop(columns=["sample"])
    logger.info(merged_data.head())

    cph = CoxPHFitter()
    cph.fit(merged_data, duration_col="OS.time", event_col="OS")

    # Display the summary of the Cox Proportional Hazards model
    cph.print_summary()
    
    # Draw plots
    cph.print_summary()  # Print the summary of the Cox model
    cph.plot()

    plt.title('Cox Model')
    plt.xlabel('log(HR) (95% CI)')
    plt.xlim(left=-1.4, right=1.4)
    plt.ylim(bottom=-0.3)

    # Save the plot to a file (e.g., as a PNG)
    plt.savefig('public/data/CoxPH.png', format='png')  # You can change the file name and format here
    plt.show()

run()