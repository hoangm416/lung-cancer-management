import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// const ageData = [
//   { ageRange: "0-10", count: 5 },
//   { ageRange: "11-20", count: 15 },
//   { ageRange: "21-30", count: 25 },
//   { ageRange: "31-40", count: 20 },
//   { ageRange: "41-50", count: 10 },
//   { ageRange: "51-60", count: 8 },
//   { ageRange: "61-70", count: 12 },
//   { ageRange: "71-80", count: 6 },
//   { ageRange: "81+", count: 3 },
// ];

const HistogramChart = ({ data }: { data: { ageRange: string; count: number }[] }) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="ageRange" label={{ value: "Độ tuổi", position: "insideBottom", offset: -5 }} />
      <YAxis label={{ value: "Số lượng", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
    </BarChart>
  );
};

export default HistogramChart;