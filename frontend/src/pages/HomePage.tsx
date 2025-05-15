import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import BarChartComponent from "@/components/BarChartComponent";
import KaplanMeierChart from "@/components/KaplanMeierChart";
import { useGetRecord } from "@/api/LungRecordApi";
import KaplanMeierImage from "@/assets/kaplan_meier_curve.png";

const HomePage = () => {
  const { records, isLoading } = useGetRecord();
  if (isLoading) return <div>Đang tải dữ liệu...</div>;

// Xử lý dữ liệu biểu đồ tỷ lệ giới tính
  const genderCounts = records.reduce(
    (acc, record) => {
      const gender = record.gender?.toLowerCase();
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
    const age = Number(record.age_at_index);
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

  // Xử lý dữ liệu biểu đồ Kaplan-Meier
  const sampleData = [
    { day: 0, survival: 1.0 },
    { day: 30, survival: 0.95 },
    { day: 60, survival: 0.88 },
    { day: 120, survival: 0.8 },
    { day: 200, survival: 0.75 },
    { day: 300, survival: 0.6 },
    { day: 365, survival: 0.55 },
  ];
  
  type RecordType = {
    days_to_death?: number | string | null;
  };
  
  function getKaplanMeierData(records: RecordType[]) {
    // Lọc những mẫu có days_to_death là số
    const validRecords = records
      .map((r) => Number(r.days_to_death))
      .filter((d) => !isNaN(d) && d > 0)
      .sort((a, b) => a - b);
  
    const total = validRecords.length;
    if (total === 0) return [];
  
    // Đếm số người chết tại từng ngày
    const deathCounts = new Map<number, number>();
    for (const day of validRecords) {
      deathCounts.set(day, (deathCounts.get(day) || 0) + 1);
    }
  
    // Tính tỷ lệ sống sót
    const result: { day: number; survival: number }[] = [];
    let survival = 1.0;
    let atRisk = total;
  
    const sortedDays = Array.from(deathCounts.keys()).sort((a, b) => a - b);
    for (const day of sortedDays) {
      const deaths = deathCounts.get(day)!;
      survival *= 1 - deaths / atRisk;
      result.push({ day, survival: parseFloat(survival.toFixed(4)) });
      atRisk -= deaths;
    }
  
    return result;
  }

  const kmData = getKaplanMeierData(records);

  // const genderData = records.reduce((acc, record) => {
  //   const genderGroup = getGenderGroup(record.gender); 
  //   const existingGroup = acc.find((item) => item.name === genderGroup);

  //   if (existingGroup) {
  //     existingGroup.value += 1; 
  //   } else {
  //     acc.push({ name: genderGroup ?? "Không xác định", value: 1 });
  //   }

  //   return acc;
  // }, [] as { name: string; value: number }[]);

  // const getGenderGroup = (gender: string | undefined) => {
  //   if (!gender) return "Không xác định";
  //   if (gender.toLowerCase() === "nam" || gender.toLowerCase() === "male") return "Nam";
  //   if (gender.toLowerCase() === "nữ" || gender.toLowerCase() === "female") return "Nữ";
  //   return "Không xác định"; 
  // };

  // console.log("Gender data:", genderData)

  return (
    <div className="flex flex-col gap-10">
      <div className="text-left">
        <span className="font-bold text-3xl">
          Thống kê tổng quan
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        {/* Cột 1: Biểu đồ PieChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Tỷ lệ giới tính</h2>
          <PieChartComponent data={genderData}/>
        </div>

        {/* Cột 2: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Phân bố độ tuổi</h2>
          <HistogramChart data={ageData}/>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Cột 1: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Giai đoạn bệnh theo AJCC</h2>
          <HistogramChart data={ajccStageData} />
        </div>

        {/* Cột 2: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4"></h2>
          <img src={KaplanMeierImage} alt="Biểu đồ Kaplan-Meier" className="w-[750px] h-auto rounded-xl shadow" />
          {/* <KaplanMeierChart data={kmData} /> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;