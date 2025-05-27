import { useEffect, useState } from 'react';
import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import BarChartComponent from "@/components/BarChartComponent";
//import KaplanMeierChart from "@/components/KaplanMeierChart";
import KaplanMeierComparisonChart from "@/components/KaplanMeierComparisonChart";
import { useGetRecord } from "@/api/LungRecordApi";
import { Card, CardContent } from "@/components/ui/card";
import KaplanMeierImage from "@/assets/kaplan_meier_curve.png";
import { loadTSV } from "@/utils/loadTSV";
import { prepareOSUngroupedData, prepareDFSData, prepareOSGroupedData } from "@/utils/prepareKaplanMeierData.ts"
import FullscreenContainer from '@/components/FullScreenContainer';

const HomePage = () => {
  const { records, isLoading } = useGetRecord();
  const [OSdata, setOSData] = useState<any[]>([]);
  const [mergedData, setMergedData] = useState<any[]>([]);

  useEffect(() => {
    loadTSV('/data/TCGA-LUAD.survival.tsv')
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
          return {...rec, ...match};
        }
        return null;
      })
      .filter(Boolean);

    setMergedData(merged);
    console.log("🔗 Merged filtered data:", merged);
  }
}, [OSdata, records]);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

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
  
  // type RecordType = {
  //   overall_survival_months?: number | string | null;
  // };
  
  // function getKaplanMeierData(records: RecordType[]) {
  //   // Lọc những mẫu có days_to_death là số
  //   const validRecords = records
  //     .map((r) => Number(r.overall_survival_months))
  //     .filter((d) => !isNaN(d) && d > 0)
  //     .sort((a, b) => a - b);
  
  //   const total = records.length;
  //   if (total === 0) return [];
  
  //   // Đếm số người chết tại từng ngày
  //   const deathCounts = new Map<number, number>();
  //   for (const day of validRecords) {
  //     deathCounts.set(day, (deathCounts.get(day) || 0) + 1);
  //   }
  
  //   //Tính tỷ lệ sống sót
  //   const result: { day: number; survival: number }[] = [];
  //   let survival = 1.0;
  //   let atRisk = total;
  
  //   const sortedDays = Array.from(deathCounts.keys()).sort((a, b) => a - b);
  //   for (const day of sortedDays) {
  //     const deaths = deathCounts.get(day)!;
  //     survival *= 1 - deaths / atRisk;
  //     result.push({ day, survival: parseFloat(survival.toFixed(4)) });
  //     atRisk -= deaths;
  //   }

  //   return result;
  // }

  // type PatientRecord = {
  //   days_to_death: number;
  // };

  // type KaplanMeierDataPoint = {
  //   day: number;
  //   survival: number;
  // };

  // function calculateKaplanMeierCurve(records: PatientRecord[]): KaplanMeierDataPoint[] {
  //   if (records.length === 0) return [];

  //   // Đếm số ca tử vong theo từng ngày
  //   const deathCounts = new Map<number, number>();
  //   for (const record of records) {
  //     const day = Math.floor(record.days_to_death);
  //     if (!deathCounts.has(day)) {
  //       deathCounts.set(day, 1);
  //     } else {
  //       deathCounts.set(day, deathCounts.get(day)! + 1);
  //     }
  //   }

  //   // Sắp xếp các ngày tử vong tăng dần
  //   const sortedDays = Array.from(deathCounts.keys()).sort((a, b) => a - b);

  //   const result: KaplanMeierDataPoint[] = [];
  //   let survival = 1.0;
  //   let atRisk = records.length;

  //   for (const day of sortedDays) {
  //     const deaths = deathCounts.get(day)!;
  //     survival *= 1 - deaths / atRisk;
  //     result.push({ day, survival: parseFloat(survival.toFixed(4)) });
  //     atRisk -= deaths;
  //   }

  //   // Bổ sung điểm tại mốc 2 năm nếu chưa có
  //   const lastDay = result.length > 0 ? result[result.length - 1].day : 0;
  //   if (lastDay < 730) {
  //     result.push({ day: 730, survival: parseFloat(survival.toFixed(4)) });
  //   }

  //   return result;
  // }

  // const kmData = getKaplanMeierData(records);

  // Dữ liệu sống sót Kaplan-Meier tổng thể
  const kmOverall = prepareOSUngroupedData(mergedData);
  // Dữ liệu DFS
  const kmDFS = prepareDFSData(records);
  // OS Theo giới tính
  const KMCbySex = prepareOSGroupedData(mergedData, "sex");
  console.log("KMC by sex:", KMCbySex);
  // OS Theo giai đoạn ung thư
  const KMCbyStage = prepareOSGroupedData(mergedData, "ajcc_pathologic_stage");
  console.log("KMC by stage:", KMCbyStage);
  // OS Theo nhóm tuổi
  const KMCbyAgeGroup = prepareOSGroupedData(mergedData, "diagnosis_age", [0, 15, 24, 44, 60]);
  console.log("KMC by age group:", KMCbyAgeGroup);

  return (
    <div className="flex flex-col gap-10">
      <div className="text-left">
        <span className="font-bold text-3xl">
          Thống kê tổng quan
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-10 mb-20">
        {/* Cột 1: Biểu đồ PieChart */}
        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Tỷ lệ giới tính</h2>
            <PieChartComponent data={genderData} />
          </FullscreenContainer>
        </div>

        {/* Cột 2: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Phân bố độ tuổi</h2>
            <HistogramChart data={ageData}/>
          </FullscreenContainer>
        </div>

        {/* Cột 3: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-start border border-black rounded pt-2">
          <FullscreenContainer>
            <h2 className="text-xl font-semibold text-center mb-4 mt-4">Giai đoạn bệnh theo AJCC</h2>
            <HistogramChart data={ajccStageData} />
          </FullscreenContainer>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-10 mb-20">
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

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-10 mb-20">
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

      <div className="grid gap-10 border border-black rounded">
        <div className="flex flex-col items-center justify-center border border-black rounded pt-2">
          <h2 className="text-xl font-semibold mb-4 mt-4">Biểu đồ Kaplan-Meier: OS theo giai đoạn AJCC</h2>
          <KaplanMeierComparisonChart kmcData={KMCbyStage} />
        </div>
      </div>
      
      {/* <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard</h2>
          <img
            title ="Biểu đồ Kaplan-Meier: OS với mô hình Cox-Hazard"
            src="http://localhost:5000/static/plots/kaplan_meier_from_cox.png"
            alt="Kaplan-Meier: OS from Cox"
          />
        </div>

        <div className="flex flex-col items-center justify-center border border-black rounded">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ Kaplan-Meier: OS phân theo giới tính</h2>
          <img
            title ="Biểu đồ Kaplan-Meier: OS phân theo giới tính"
            src="http://localhost:5000/static/plots/kaplan_meier_by_gender.png"
            alt="Kaplan-Meier: OS by gender"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="flex flex-col items-center justify-center border border-black rounded">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ Kaplan-Meier: OS phân theo nhóm tuổi</h2>
          <img
            title ="Biểu đồ Kaplan-Meier: OS phân theo nhóm tuổi"
            src="http://localhost:5000/static/plots/kaplan_meier_by_age_group.png"
            alt="Kaplan-Meier: OS by age group"
          />
        </div>

        <div className="flex flex-col items-center justify-center border border-black rounded">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ Kaplan-Meier: OS phân theo giai đoạn AJCC</h2>
          <Card>
            <CardContent>
              <img src="http://localhost:5000/static/plots/kaplan_meier_by_ajcc_stage.png" alt="Kaplan-Meier: OS by AJCC Stage" />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Kaplan-Meier: OS Curve by AJCC Stage
              </p>
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;