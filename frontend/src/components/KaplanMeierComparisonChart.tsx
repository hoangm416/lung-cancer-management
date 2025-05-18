import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KMPoint {
  time: number;
  survival: number;
}

interface KMGroup {
  group: string;
  data: KMPoint[];
}

interface KaplanMeierChartProps {
  kmcData: KMGroup[];
}

export default function KaplanMeierComparisonChart({ kmcData }: KaplanMeierChartProps) {
  const allTimes = kmcData.flatMap(group => group.data.map(point => point.time));
  const maxTime = Math.max(...allTimes);
  const maxTick = Math.ceil(maxTime / 1000) * 1000;
  const tickValues = Array.from({ length: maxTick / 1000 + 1 }, (_, i) => i * 1000);


  return (
    <div className="p-4 rounded-xl shadow w-full">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={mergeKMData(kmcData)}
          margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
        >
          <XAxis
            dataKey="time"
            type="number"
            ticks={tickValues}
            domain={[0, maxTick + 100]}
            interval={0}
            allowDuplicatedCategory={false}
            label={{ value: 'Time (days)', position: 'insideBottom', offset: -10 }}
          />

          <YAxis domain={[0, 1]} label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ marginTop: 20 }}
            iconSize={14}
            content={(props) => {
              const { payload } = props;
              return (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginTop: 10 }}>
                  {payload?.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {/* Icon dạng đường thẳng */}
                      <div style={{
                        width: 30,
                        height: 2,
                        backgroundColor: entry.color,
                        marginRight: 5,
                      }} />
                      {/* Tên nhóm */}
                      <span style={{ color: entry.color, fontSize: 14 }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />

          {kmcData.map((group, index) => (
            <Line
              key={index}
              type="stepAfter"
              dataKey={group.group}
              stroke={index === 0 ? '#1f77b4' : '#ff7f0e'}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ⚙️ Hàm gộp dữ liệu Kaplan-Meier từ nhiều nhóm
function mergeKMData(kmcData: KMGroup[]) {
  const allTimes = new Set<number>();
  kmcData.forEach(group => {
    group.data.forEach(point => allTimes.add(point.time));
  });

  const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

  return sortedTimes.map(time => {
    const entry: any = { time };
    kmcData.forEach(group => {
      const match = group.data.find(d => d.time === time);
      entry[group.group] = match ? match.survival : null;
    });
    return entry;
  });
}
