import { useEffect, useState, useMemo } from "react";
import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import BarChartComponent from "@/components/BarChartComponent";
//import KaplanMeierChart from "@/components/KaplanMeierChart";
import KaplanMeierComparisonChart from "@/components/KaplanMeierComparisonChart";
import { useGetRecord } from "@/api/LungRecordApi";
import { Card, CardContent } from "@/components/ui/card";
import KaplanMeierImage from "@/assets/kaplan_meier_curve.png";
import { loadTSV } from "@/utils/loadTSV";
import { prepareOSUngroupedData, prepareDFSData, prepareOSGroupedData } from "@/utils/prepareKaplanMeierData";
import FullscreenContainer from "@/components/FullScreenContainer";
import ChartDropdown, { ChartOption } from "@/components/ChartDropdown";

const HomePage = () => {
  const { records = [], isLoading } = useGetRecord();
  const [OSdata, setOSData] = useState<any[]>([]);
  const [mergedData, setMergedData] = useState<any[]>([]);

  const defaultCharts = [
    { value: "gender", label: "Tỷ lệ giới tính" },
    { value: "age", label: "Phân bố độ tuổi" },
    { value: "ajcc", label: "Giai đoạn AJCC" },
    { value: "km_overall", label: "Kaplan-Meier OS" },
    { value: "km_dfs", label: "Kaplan-Meier DFS" },
    { value: "km_sex", label: "Kaplan-Meier OS theo giới tính" },
    { value: "km_age", label: "Kaplan-Meier OS theo độ tuổi" },
    { value: "km_ajcc", label: "Kaplan-Meier OS theo giai đoạn AJCC" },
    { value: "km_cox", label: "Kaplan-Meier OS với mô hình Cox-Hazard" },
  ];
  const [selectedCharts, setSelectedCharts] = useState(defaultCharts);
  const smallChartKeys = ["gender", "age", "ajcc"];
  const largeChartKeys = ["km_overall", "km_dfs", "km_sex", "km_age", "km_ajcc", "km_cox"];
  const smallCharts = selectedCharts.filter((c) => smallChartKeys.includes(c.value));
  const largeCharts = selectedCharts.filter((c) => largeChartKeys.includes(c.value));
  

  useEffect(() => {
    loadTSV("/data/TCGA-LUAD.survival.tsv")
      .then(setOSData)
      .catch((err) => console.error("❌ Failed to load TSV:", err));
  }, []);

  useEffect(() => {
    if (OSdata.length > 0 && records.length > 0) {
      const osMap = new Map(OSdata.map(os => [os._PATIENT, os]));
      const merged = records
        .map((rec) => {
          const match = osMap.get(rec.patient_id);
          if (match) {
            return { ...rec, ...match };          }
          return null;
        })
        .filter(Boolean);

      setMergedData(merged as any[]);
      //console.log("🔗 Merged filtered data:", merged);
    }
  }, [OSdata, records]);

  // Xử lý dữ liệu biểu đồ tỷ lệ giới tính
  const genderCounts = records.reduce(
    (acc, record) => {
      const gender = record.sex?.toLowerCase();
      if (gender === "male" || gender === "nam") {
        acc.male++;
      } else if (gender === "female" || gender === "nữ") {
        acc.female++;
      } else {
        acc.undefined++;
      }      
      return acc;
    },
    { male: 0, female: 0, undefined: 0 }
  );
  
  const genderData = [
    { name: "Nam", value: genderCounts.male },
    { name: "Nữ", value: genderCounts.female },
    { name: "Không xác định", value: genderCounts.undefined },
  ];

  // Xử lý dữ liệu biểu đồ độ tuổi
  const ageGroups = new Map<string, number>();
  for (const record of records) {
    const age = Number(record.diagnosis_age);
    if (isNaN(age)) continue;

    const bucket = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
    ageGroups.set(bucket, (ageGroups.get(bucket) || 0) + 1);
  }

  // Xử lý dữ liệu biểu đồ giai đoạn AJCC
  const ageData = Array.from(ageGroups.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      // Sắp xếp theo độ tuổi tăng dần
      const aStart = parseInt(a.name.split("-")[0]);
      const bStart = parseInt(b.name.split("-")[0]);
      return aStart - bStart;
    });
  
  const ajccStageCounts = records.reduce(
    (acc, record) => {
      const ajccStage = record.ajcc_pathologic_stage?.toLowerCase();
      if (ajccStage === "stage ia") {
        acc.ia++;
      } else if (ajccStage === "stage ib") {
        acc.ib++;
      } else if (ajccStage === "stage iia") {
        acc.iia++;
      }
      else if (ajccStage === "stage iib") {
        acc.iib++;
      }
      else if (ajccStage === "stage iiia") {
        acc.iiia++;
      }
      else if (ajccStage === "stage iiib") {
        acc.iiib++;
      }
      else if (ajccStage === "stage iv") {
        acc.iv++;
      } else {
        acc.undefined++;
      }      
      return acc;
    },
    { ia: 0, ib: 0, iia: 0, iib: 0, iiia: 0, iiib: 0, iv: 0, undefined: 0 }
  );
  
  const ajccStageData = [
    { name: "IA", count: ajccStageCounts.ia },
    { name: "IB", count: ajccStageCounts.ib }, 
    { name: "IIA", count: ajccStageCounts.iia },
    { name: "IIB", count: ajccStageCounts.iib },
    { name: "IIIA", count: ajccStageCounts.iiia },
    { name: "IIIB", count: ajccStageCounts.iiib },
    { name: "IV", count: ajccStageCounts.iv },
    // { name: "Không xác định", count: ajccStageCounts.undefined },
  ];

  // Dữ liệu sống sót Kaplan-Meier tổng thể
  const kmOverall = useMemo(() => mergedData.length > 0 ? prepareOSUngroupedData(mergedData) : [], [mergedData]);

  // Dữ liệu DFS
  const kmDFS = useMemo(() => records.length > 0 ? prepareDFSData(records) : [], [records]);

  // OS theo giới tính
  const KMCbySex = useMemo(() => mergedData.length > 0 ? prepareOSGroupedData(mergedData, "sex") : [], [mergedData]);

  // OS theo giai đoạn
  const KMCbyStage = useMemo(() => mergedData.length > 0 ? prepareOSGroupedData(mergedData, "ajcc_pathologic_stage") : [], [mergedData]);

  // OS theo nhóm tuổi
  const KMCbyAgeGroup = useMemo(() => mergedData.length > 0 ? prepareOSGroupedData(mergedData, "diagnosis_age", [0, 15, 24, 44, 60]) : [], [mergedData]);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="text-left">
        <span className="font-bold text-3xl">
          Thống kê tổng quan
        </span>
      </div>

      <ChartDropdown
        selectedCharts={selectedCharts}
        onChange={(selected) => setSelectedCharts(selected)}
      />

      {/* Nhóm biểu đồ nhỏ: 3 cột (Pie, Histogram) */}
      {smallCharts.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
          {smallCharts.map((chart) => {
            switch (chart.value) {
              case "gender":
                return (
                  <div key="gender" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Tỷ lệ giới tính</h2>
                      <PieChartComponent data={genderData} />
                    </FullscreenContainer>
                  </div>
                );
              case "age":
                return (
                  <div key="age" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Phân bố độ tuổi</h2>
                      <HistogramChart data={ageData} />
                    </FullscreenContainer>
                  </div>
                );
              case "ajcc":
                return (
                  <div key="ajcc" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Giai đoạn bệnh theo AJCC</h2>
                      <HistogramChart data={ajccStageData} />
                    </FullscreenContainer>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {/* Nhóm biểu đồ lớn: 2 cột (Kaplan-Meier) */}
      {largeCharts.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(600px,1fr))] gap-10 mb-20">
          {largeCharts.map((chart) => {
            switch (chart.value) {
              case "km_overall":
                return (
                  <div key="km_overall" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: Sống sót tổng thể (OS)</h2>
                      <KaplanMeierComparisonChart kmcData={kmOverall} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_dfs":
                return (
                  <div key="km_dfs" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: DFS</h2>
                      <KaplanMeierComparisonChart kmcData={kmDFS} />
                    </FullscreenContainer>
                  </div>
                );
                case "km_sex":
                return (
                  <div key="km_sex" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giới tính</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbySex} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_age":
                return (
                  <div key="km_age" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo độ tuổi</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbyAgeGroup} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_ajcc":
                return (
                  <div key="km_ajcc" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbyStage} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_cox":
                return (
                  <div key="km_cox" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold items-center justify-center mb-4">Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard</h2>
                      <img
                        title ="Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard"
                        src="http://localhost:5000/static/plots/kaplan_meier_from_cox.png"
                        alt="Kaplan-Meier: OS from Cox"
                      />
                    </FullscreenContainer>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Tỷ lệ giới tính</h2>
            <PieChartComponent data={genderData} />
          </FullscreenContainer>
        </div>

        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Phân bố độ tuổi</h2>
            <HistogramChart data={ageData}/>
          </FullscreenContainer>
        </div>

        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Giai đoạn bệnh theo AJCC</h2>
            <HistogramChart data={ajccStageData} />
          </FullscreenContainer>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: Sống sót tổng thể (OS)</h2>
            <KaplanMeierComparisonChart kmcData={kmOverall} />
          </FullscreenContainer>
        </div>

        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: DFS</h2>
            <KaplanMeierComparisonChart kmcData={kmDFS} />
          </FullscreenContainer>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giới tính</h2>
            <KaplanMeierComparisonChart kmcData={KMCbySex} />
          </FullscreenContainer>
        </div>

        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo độ tuổi</h2>
            <KaplanMeierComparisonChart kmcData={KMCbyAgeGroup} />
          </FullscreenContainer>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC</h2>
            <KaplanMeierComparisonChart kmcData={KMCbyStage} />
          </FullscreenContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold items-center justify-center mb-4">Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard</h2>
            <img
              title ="Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard"
              src="http://localhost:5000/static/plots/kaplan_meier_from_cox.png"
              alt="Kaplan-Meier: OS from Cox"
            />
          </FullscreenContainer>
        </div>
      </div> */}

    </div>
  );
};

export default HomePage;