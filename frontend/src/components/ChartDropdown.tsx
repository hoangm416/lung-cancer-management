import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";

export interface ChartOption {
  label: string;
  value: string;
}

const chartOptions: ChartOption[] = [
  { label: "Tỷ lệ giới tính", value: "gender" },
  { label: "Phân bố độ tuổi", value: "age" },
  { label: "Giai đoạn bệnh theo AJCC", value: "ajcc" },
  { label: "Mô tả di căn xa (M) theo AJCC", value: "ajcc_m" },
  { label: "Mô tả hạch (N) theo AJCC", value: "ajcc_n" },
  { label: "Mô tả khối u (T) theo AJCC", value: "ajcc_t" },
  { label: "Mutation Count", value: "mutation_count" },
  { label: "Kaplan-Meier: Sống sót tổng thể (OS)", value: "km_overall" },
  { label: "Kaplan-Meier: Sống sót không bệnh (DFS)", value: "km_dfs" },
  { label: "Kaplan-Meier: OS theo giới tính", value: "km_sex"},
  { label: "Kaplan-Meier: OS theo độ tuổi", value: "km_age" },
  { label: "Kaplan-Meier: OS theo giai đoạn AJCC", value: "km_ajcc" },
  { label: "Kaplan-Meier: OS theo giai đoạn AJCC-M", value: "km_ajcc_m" },
  { label: "Kaplan-Meier: OS theo giai đoạn AJCC-N", value: "km_ajcc_n" },
  { label: "Kaplan-Meier: OS theo giai đoạn AJCC-T", value: "km_ajcc_t" },
  { label: "Kaplan-Meier: OS với mô hình Cox-Hazard", value: "km_cox" },
];

interface ChartDropdownProps {
  selectedCharts: ChartOption[];
  onChange: (selected: ChartOption[]) => void;
}

const ChartDropdown: React.FC<ChartDropdownProps> = ({
  selectedCharts,
  onChange,
}) => {
  const [selected, setSelected] = useState<ChartOption[]>(selectedCharts);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <div className="w-[300px]">
      <MultiSelect
        options={chartOptions}
        value={selected}
        onChange={setSelected}
        labelledBy="Charts"
        hasSelectAll={true}
        overrideStrings={{
          selectSomeItems: "Chọn các biểu dồ",
          allItemsAreSelected: "Tất cả biểu đồ đã được chọn",
          search: "Tìm kiếm...",
          selectAll: "Chọn tất cả",
          selectAllFiltered: "Chọn tât cả đã lọc",
          deselectAll: "Bỏ chọn tất cả",
          noOptions: "Không có biểu đồ nào",
        }}
      />
    </div>
  );
};

export default ChartDropdown;
