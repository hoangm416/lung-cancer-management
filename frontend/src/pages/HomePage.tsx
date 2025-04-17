import PieChartComponent from "@/components/PieChartComponent";
import HistogramChart from "@/components/HistogramChart";
import { useGetRecord } from "@/api/LungRecordApi";

const HomePage = () => {
  // const { records, isLoading } = useGetRecord() 

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
          <PieChartComponent />
        </div>

        {/* Cột 2: Biểu đồ HistogramChart */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Phân bố độ tuổi</h2>
          <HistogramChart />
        </div>
      </div>
    </div>
  );
};

export default HomePage;