import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type KaplanMeierDataPoint = {
  day: number;
  survival: number;
};

type Props = {
  data: KaplanMeierDataPoint[];
};

const KaplanMeierChart = ({ data }: Props) => {
  // Tạo các mốc x-axis từ 0.1 -> 1.0 năm (mỗi mốc 36.5 ngày)
  const xTicks = Array.from({ length: 10 }, (_, i) => Math.round((i + 1) * 73));

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow w-[750px]">
      <h2 className="text-lg font-semibold mb-4">Biểu đồ Kaplan-Meier</h2>
      <LineChart width={730} height={300} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
            type="number"
            dataKey="day"
            domain={[0, 7000]}
            tickCount={10}
            ticks={[ 1000, 2000, 3000, 4000, 5000, 6000, 7000 ]}
            tickFormatter={(day) => (day / 365).toFixed(1)}
            label={{
                value: 'Thời gian (ngày)',
                position: 'insideBottom',
                offset: -10,
            }}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          label={{
            value: 'Tỷ lệ sống sót',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
          }}
        />
        <Tooltip
          formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
          labelFormatter={(label) => `Ngày: ${label}`}
        />
        <Line
          type="stepAfter"
          dataKey="survival"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
};

export default KaplanMeierChart;
