import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, DotProps } from 'recharts';
import { FC } from "react";

const lineColors = [
  '#1f77b4', // xanh dương
  '#ff7f0e', // cam
  '#2ca02c', // xanh lá
  '#d62728', // đỏ
  '#9467bd', // tím
  '#8c564b', // nâu
  '#e377c2', // hồng
  '#7f7f7f', // xám
  '#bcbd22', // vàng chanh
  '#17becf'  // xanh ngọc
];

interface CustomDotProps extends DotProps {
  payload?: any;
  color?: string;
  dataKey?: string;
}

const CensorDot: FC<CustomDotProps> = ({ cx, cy, payload, dataKey, color }) => {
  const groupKey = dataKey as string;
  const eventKey = `${groupKey}_event`;

  if (payload?.[eventKey] === 1 && cx !== undefined && cy !== undefined) {
    return (
      <text
        x={cx}
        y={cy}
        dy={6}
        textAnchor="middle"
        fontSize={20}
        fontWeight="900"
        fill={color || "black"}
        pointerEvents="none"
      >
        +
      </text>
    );
  }

  return null;
};

interface KMPoint {
  time: number;
  survival: number;
  event?: number;
}

interface KMGroup {
  group: string;
  data: KMPoint[];
}

interface KaplanMeierChartProps {
  kmcData: KMGroup[];
}

export default function KaplanMeierComparisonChart({ kmcData }: KaplanMeierChartProps) {
  if (!kmcData || kmcData.length === 0) {
    return <div>Loading...</div>;
  }
  const filteredData = kmcData.filter(group => group.group !== "NA");
  // Tính max thời gian và ticks XAxis
  const allTimes = filteredData.flatMap(group => group.data.map(point => point.time));
  const maxTime = Math.max(...allTimes);
  const maxTick = Math.ceil(maxTime / 1000) * 1000;
  const tickValues = Array.from({ length: maxTick / 1000 + 1 }, (_, i) => i * 1000);

  // Map nhóm sang màu
  const groupColorMap = new Map<string, string>();
  filteredData.forEach((group, index) => {
    const color = lineColors[index % lineColors.length];
    groupColorMap.set(group.group, color);
  });

  // Gom dữ liệu
  const mergedData = mergeKMData(filteredData);

  return (
    <div className="p-4 rounded-xl shadow w-full">
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={mergedData}
          margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
        >
          <XAxis
            dataKey="time"
            type="number"
            ticks={tickValues}
            domain={[0, maxTick + 100]}
            interval={0}
            allowDuplicatedCategory={false}
            label={{ value: 'Time (days)', position: 'insideBottom', offset: -20 }}
          />

          <YAxis
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100)}%`}
            label={{ angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
            labelFormatter={(label) => `Time: ${label} days`}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ marginTop: 20, paddingTop: 30 }}
            iconSize={14}
            content={({ payload }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 30,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: 10,
                }}
              >
                {payload?.map((entry, index) => {
                  const color = groupColorMap.get(entry.value) || '#000';
                  return (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: 30,
                          height: 2,
                          backgroundColor: color,
                          marginRight: 5,
                        }}
                      />
                      <span style={{ color, fontSize: 14 }}>{entry.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          />

          {filteredData.map((group) => {
  const color = groupColorMap.get(group.group) || '#000';
  const groupSeries = getGroupSeries(group.group, mergedData);

  return (
    <Line
      key={group.group}
      type="stepAfter"
      data={groupSeries}
      dataKey="survival"
      name={group.group}
      stroke={color}
      strokeWidth={1.5}
      isAnimationActive={false}
      dot={(props) => {
  if (props.payload.event === 0) {
    return (
      <text
        x={props.cx}
        y={props.cy}
        dy={6}
        textAnchor="middle"
        fontSize={20}
        fontWeight="900"
        fill={color}
        pointerEvents="none"
      >
        +
      </text>
    );
  }
  return <g />;
}}

      activeDot={{ r: 4 }}
    />
  );
})}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function mergeKMData(kmcData: KMGroup[]) {
  const allTimes = new Set<number>();
  kmcData.forEach(group => {
    group.data.forEach(point => allTimes.add(point.time));
  });

  allTimes.add(0);

  const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

  const lastSurvival: Record<string, number> = {};
  kmcData.forEach(group => {
    lastSurvival[group.group] = 1;
  });

  return sortedTimes.map(time => {
    const entry: any = { time };

    kmcData.forEach(group => {
      const match = group.data.find(d => d.time === time);
      if (match) {
        lastSurvival[group.group] = match.survival;
        entry[group.group] = match.survival;
        entry[`${group.group}_event`] = match.event ?? 1;
      } else {
        entry[group.group] = lastSurvival[group.group];
        entry[`${group.group}_event`] = undefined;
      }
    });

    return entry;
  });
}


function getGroupSeries(group: string, mergedData: any[]): any[] {
  return mergedData.map((entry) => ({
    time: entry.time,
    survival: entry[group],
    event: entry[`${group}_event`],
  }));
}
