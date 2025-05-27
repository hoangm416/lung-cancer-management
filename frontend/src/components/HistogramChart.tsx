import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomizedTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="start"
      fill="#666"
      transform={`rotate(60, ${x + 3}, ${y + 5})`}
      fontSize={12}
    >
      {payload.value}
    </text>
  );
};

const HistogramChart = ({ data }: { data: { name: string; count: number }[] }) => {
  return (
    <div style={{ width: "100%", maxWidth: 700, height: "100%", maxHeight: 350, margin: "0 auto", }}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 15, 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ position: "insideBottom", offset: -5 }} tick={CustomizedTick} />
          <YAxis
            label={{ value: "Số lượng", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
        </BarChart >
      </ResponsiveContainer>
    </div>
  );
};

export default HistogramChart;
