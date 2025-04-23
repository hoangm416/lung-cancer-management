import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import { useGetRecord } from "@/api/LungRecordApi";

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
    { male: 0, female: 0, undefined:0 }
  );
  
  const gendertData = [
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

  const ageData = Array.from(ageGroups.entries())
    .map(([ageRange, count]) => ({ ageRange, count }))
    .sort((a, b) => {
      // Sắp xếp theo độ tuổi tăng dần
      const aStart = parseInt(a.ageRange.split("-")[0]);
      const bStart = parseInt(b.ageRange.split("-")[0]);
      return aStart - bStart;
    });

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
      <div className="grid md:grid-cols-2 gap-10">
        {/* Cột 1: Biểu đồ PieChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Tỷ lệ giới tính</h2>
          <PieChartComponent data={gendertData}/>
        </div>

        {/* Cột 2: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Phân bố độ tuổi</h2>
          <HistogramChart data={ageData}/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;