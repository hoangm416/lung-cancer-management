import { useEffect, useState, useMemo } from "react";
import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import BarChartComponent from "@/components/BarChartComponent";
// import KaplanMeierChart from "@/components/KaplanMeierChart";
import KaplanMeierComparisonChart from "@/components/KaplanMeierComparisonChart";
import { useGetRecord } from "@/api/LungRecordApi";
// import { Card, CardContent } from "@/components/ui/card";
import KaplanMeierImage from "@/assets/kaplan_meier_curve.png";
import { loadTSV } from "@/utils/loadTSV";
import { prepareOSUngroupedData, prepareDFSData, prepareOSGroupedData } from "@/utils/prepareKaplanMeierData";
import FullscreenContainer from "@/components/FullScreenContainer";
import ChartDropdown, { ChartOption } from "@/components/ChartDropdown";

const HomePage = () => {
  const { records = [], isLoading } = useGetRecord();
  const [OSdata, setOSData] = useState<any[]>([]);
  // const [mergedData, setMergedData] = useState<any[]>([]);

  const defaultCharts = [
    { value: "gender", label: "Tỷ lệ giới tính" },
    { value: "age", label: "Phân bố độ tuổi" },
    { value: "ajcc", label: "Giai đoạn AJCC" },
    { value: "ajcc_m", label: "Giai đoạn M theo AJCC" },
    { value: "ajcc_n", label: "Giai đoạn N theo AJCC" },
    { value: "ajcc_t", label: "Giai đoạn T theo AJCC" },
    { value: "mutation_count", label: "Số lượng đột biến" },
    { value: "km_overall", label: "Kaplan-Meier OS" },
    { value: "km_dfs", label: "Kaplan-Meier DFS" },
    { value: "km_sex", label: "Kaplan-Meier OS theo giới tính" },
    { value: "km_age", label: "Kaplan-Meier OS theo độ tuổi" },
    { value: "km_ajcc", label: "Kaplan-Meier OS theo giai đoạn AJCC" },
    { value: "km_ajcc_m", label: "Kaplan-Meier OS theo giai đoạn AJCC-M" },
    { value: "km_ajcc_n", label: "Kaplan-Meier OS theo giai đoạn AJCC-N" },
    { value: "km_ajcc_t", label: "Kaplan-Meier OS theo giai đoạn AJCC-T" },
    { value: "km_cox", label: "Kaplan-Meier OS với mô hình Cox-Hazard" },
  ];
  const [selectedCharts, setSelectedCharts] = useState(defaultCharts);
  const smallChartKeys = ["gender", "age", "ajcc", "ajcc_m", "ajcc_n", "ajcc_t"];
  const largeChartKeys = ["mutation_count", "km_overall", "km_dfs", "km_sex", "km_age", "km_ajcc", "km_ajcc_m", "km_ajcc_n", "km_ajcc_t", "km_cox"];
  const smallCharts = selectedCharts.filter((c) => smallChartKeys.includes(c.value));
  const largeCharts = selectedCharts.filter((c) => largeChartKeys.includes(c.value));
  

  useEffect(() => {
    loadTSV("/data/TCGA-LUAD.survival.tsv")
      .then(setOSData)
      .catch((err) => console.error("❌ Failed to load TSV:", err));
  }, []);

  // useEffect(() => {
  //   if (OSdata.length > 0 && records.length > 0) {
  //     const osMap = new Map(OSdata.map(os => [os._PATIENT, os]));
  //     const merged = records
  //       .map((rec) => {
  //         const match = osMap.get(rec.patient_id);
  //         if (match) {
  //           return { ...rec, ...match };          }
  //         return null;
  //       })
  //       .filter(Boolean);

  //     setMergedData(merged as any[]);
  //   }
  // }, [OSdata, records]);

  // Xử lý dữ liệu biểu đồ tỷ lệ giới tính
  const genderCounts = records.reduce(
    (acc, record) => {
      const gender = record.sex?.toLowerCase();
      if (gender === "male" || gender === "nam") {
        acc.male++;
      } else if (gender === "female" || gender === "nữ") {
        acc.female++;
      } else {
        acc.na++;
      }      
      return acc;
    },
    { male: 0, female: 0, na: 0 }
  );
  
  const genderData = [
    { name: "Nam", value: genderCounts.male },
    { name: "Nữ", value: genderCounts.female },
    { name: "Không xác định", value: genderCounts.na },
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
        acc.na++;
      }      
      return acc;
    },
    { ia: 0, ib: 0, iia: 0, iib: 0, iiia: 0, iiib: 0, iv: 0, na: 0 }
  );
  
  const ajccStageData = [
    { name: "IA", count: ajccStageCounts.ia },
    { name: "IB", count: ajccStageCounts.ib }, 
    { name: "IIA", count: ajccStageCounts.iia },
    { name: "IIB", count: ajccStageCounts.iib },
    { name: "IIIA", count: ajccStageCounts.iiia },
    { name: "IIIB", count: ajccStageCounts.iiib },
    { name: "IV", count: ajccStageCounts.iv },
    { name: "NA", count: ajccStageCounts.na },
  ];

  const ajccMCounts = records.reduce(
    (acc, record) => {
      const ajccM = record.ajcc_pathologic_m?.toLowerCase();
      if (ajccM === "m0") {
        acc.m0++;
      } else if (ajccM === "m1") {
        acc.m1++;
      } else if (ajccM === "m1a") {
        acc.m1a++;
      } else if (ajccM === "m1b") {
        acc.m1b++;
      } else if (ajccM === "mx") { 
        acc.mx++;
      } else {
        acc.na++;
      }
      return acc;
    },
    { m0: 0, m1: 0, m1a: 0, m1b: 0, mx: 0, na: 0 }
  );

  const ajccMData = [
    { name: "M0", count: ajccMCounts.m0 },
    { name: "M1", count: ajccMCounts.m1 },
    { name: "M1a", count: ajccMCounts.m1a },
    { name: "M1b", count: ajccMCounts.m1b },
    { name: "MX", count: ajccMCounts.mx },
    { name: "NA", count: ajccMCounts.na },
  ];

  const ajccNCounts = records.reduce(
    (acc, record) => { 
      const ajccN = record.ajcc_pathologic_n?.toLowerCase();
      if (ajccN === "n0") {
        acc.n0++;
      } else if (ajccN === "n1") {
        acc.n1++;
      } else if (ajccN === "n2") {
        acc.n2++;
      } else if (ajccN === "n3") {
        acc.n3++;
      } else if (ajccN === "nx") { 
        acc.nx++;
      } else {
        acc.na++;
      }
      return acc;
    }
    ,
    { n0: 0, n1: 0, n2: 0, n3: 0, nx: 0, na: 0 }
  );

  const ajccNData = [
    { name: "N0", count: ajccNCounts.n0 },
    { name: "N1", count: ajccNCounts.n1 },
    { name: "N2", count: ajccNCounts.n2 },
    { name: "N3", count: ajccNCounts.n3 },
    { name: "NX", count: ajccNCounts.nx },
    { name: "NA", count: ajccNCounts.na },
  ];

  const ajccTCounts = records.reduce(
    (acc, record) => { 
      const ajccT = record.ajcc_pathologic_t?.toLowerCase();
      if (ajccT === "t1") {
        acc.t1++;
      } else if (ajccT === "t1a") {
        acc.t1a++; 
      } else if (ajccT === "t1b") {
        acc.t1b++; 
      } else if (ajccT === "t2") {
        acc.t2++;
      } else if (ajccT === "t2a") {
        acc.t2a++;
      } else if (ajccT === "t2b") {
        acc.t2b++;
      } else if (ajccT === "t3") {
        acc.t3++;
      } else if (ajccT === "t4") {
        acc.t4++;
      } else if (ajccT === "tx") { 
        acc.tx++;
      } else {
        acc.na++;
      }
      return acc;
    }
    ,
    { t1: 0, t1a: 0, t1b: 0, t2: 0, t2a: 0, t2b: 0, t3: 0, t4: 0, tx: 0, na: 0 }
  );

  const ajccTData = [
    { name: "T1", count: ajccTCounts.t1 },
    { name: "T1a", count: ajccTCounts.t1a },
    { name: "T1b", count: ajccTCounts.t1b },
    { name: "T2", count: ajccTCounts.t2 },
    { name: "T2a", count: ajccTCounts.t2a },
    { name: "T2b", count: ajccTCounts.t2b },
    { name: "T3", count: ajccTCounts.t3 },
    { name: "T4", count: ajccTCounts.t4 },
    { name: "TX", count: ajccTCounts.tx },
    { name: "NA", count: ajccTCounts.na },
  ];

  const mutationCountGroups = new Map<string, number>();
  for (const record of records) {
    const mutationCount = record.mutation_count ? Number(record.mutation_count) : 0;
    if (isNaN(mutationCount)) continue;
    const bucket = 
      mutationCount < 100 ? "0-100" :
      mutationCount < 200 ? "100-200" :
      mutationCount < 300 ? "200-300" :
      mutationCount < 400 ? "300-400" :
      mutationCount < 500 ? "400-500" :
      mutationCount < 600 ? "500-600" :
      mutationCount < 700 ? "600-700" : "700+";
    mutationCountGroups.set(bucket, (mutationCountGroups.get(bucket) || 0) + 1);
  }

  const mutationCountData = Array.from(mutationCountGroups.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      // Sắp xếp theo số lượng đột biến tăng dần
      const aStart = parseInt(a.name.split("-")[0]);
      const bStart = parseInt(b.name.split("-")[0]);
      return aStart - bStart;
    });

  // Dữ liệu sống sót Kaplan-Meier tổng thể
  const kmOverall = useMemo(() => records.length > 0 ? prepareOSUngroupedData(records) : [], [records]);
  // Dữ liệu DFS
  const kmDFS = useMemo(() => records.length > 0 ? prepareDFSData(records) : [], [records]);
  // OS theo giới tính
  const KMCbySex = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "sex") : [], [records]);
  // OS theo nhóm tuổi
  const KMCbyAgeGroup = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "diagnosis_age", [0, 15, 24, 44, 60]) : [], [records]);
  // OS theo giai đoạn
  const KMCbyStage = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "ajcc_pathologic_stage") : [], [records]);
  // OS theo AJCC-M
  const KMCbyMStage = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "ajcc_pathologic_m") : [], [records]);
  // OS theo AJCC-N
  const KMCbyNStage = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "ajcc_pathologic_n") : [], [records]);
  // OS theo AJCC-T
  const KMCbyTStage = useMemo(() => records.length > 0 ? prepareOSGroupedData(records, "ajcc_pathologic_t") : [], [records]);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row justify-between">
        <span className="font-medium text-2xl">
          Trực quan hóa dữ liệu
        </span>
        <ChartDropdown
          selectedCharts={selectedCharts}
          onChange={(selected) => setSelectedCharts(selected)}
        />
      </div>
      

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
              case "ajcc_m":
                return (
                  <div key="ajcc_m" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Mô tả di căn xa (M) theo AJCC</h2>
                      <HistogramChart data={ajccMData} />
                    </FullscreenContainer>
                  </div>
                );
              case "ajcc_n":
                return (
                  <div key="ajcc_n" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Mô tả hạch (N) theo AJCC</h2>
                      <HistogramChart data={ajccNData} />
                    </FullscreenContainer>
                  </div>
                );
              case "ajcc_t":
                return (
                  <div key="ajcc_t" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Mô tả khối u (T) theo AJCC</h2>
                      <HistogramChart data={ajccTData} />
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
        <div className="max-w-screen-md grid grid-cols-[repeat(auto-fit,minmax(600px,1fr))] gap-10 mb-20">
          {largeCharts.map((chart) => {
            switch (chart.value) {
              case "mutation_count":
                return (
                  <div key="mutation_count" className="flex flex-col items-center justify-start border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold text-center mb-4 mt-4">Số lượng đột biến (Mutation Count)</h2>
                      <HistogramChart data={mutationCountData} />
                    </FullscreenContainer>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      )}
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
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: Sống sót không bệnh (DFS)</h2>
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
              case "km_ajcc_m":
                return (
                  <div key="km_ajcc_m" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC-M</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbyMStage} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_ajcc_n":
                return (
                  <div key="km_ajcc_n" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC-N</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbyNStage} />
                    </FullscreenContainer>
                  </div>
                );
              case "km_ajcc_t":
                return (
                  <div key="km_ajcc_t" className="flex flex-col items-center justify-center border border-black rounded pt-2">
                    <FullscreenContainer>
                      <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC-T</h2>
                      <KaplanMeierComparisonChart kmcData={KMCbyTStage} />
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
                        src={KaplanMeierImage}
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