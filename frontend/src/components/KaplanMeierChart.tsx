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
  const allDays = data.map(point => point.day);
  const maxDay = Math.max(...allDays);
  const roundedMaxDay = Math.ceil(maxDay / 1000) * 1000;
  const tickValues = Array.from({ length: roundedMaxDay / 1000 + 1 }, (_, i) => i * 1000);

  return (
    <div className="p-4 rounded-xl shadow w-full">
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 15, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="day"
            domain={[0, roundedMaxDay]}
            ticks={tickValues}
            label={{
              value: 'Time (days)',
              position: 'insideBottom',
              offset: -10,
            }}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}`}
            label={{
              value: 'Overall Survival (%)',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
            }}
          />
          <Tooltip
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
            labelFormatter={(label) => `Day: ${label}`}
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
      </ResponsiveContainer>
      <div className="bg-gray-100 p-4 rounded-xl shadow w-[750px]">
        <h2 className="text-lg font-semibold mb-4">Biểu đồ Kaplan-Meier</h2>
        <LineChart width={1460} height={600} data={data} margin={{ top: 10, right: 30, left: 15, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
              //const year = 10;
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
            tickFormatter={(v) => `${(v * 100).toFixed(0)}`}
            label={{
              value: 'Overall Survival(%)',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
            }}
          />
          <Tooltip
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
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
    </div>
  );
};

export default KaplanMeierChart;
