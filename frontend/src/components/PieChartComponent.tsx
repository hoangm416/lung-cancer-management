import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// const data = [
//   { name: "Nam", value: 300 },
//   { name: "Nữ", value: 175 },
// ];

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28"];

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <PieChart width={600} height={500}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={true}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={140}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;