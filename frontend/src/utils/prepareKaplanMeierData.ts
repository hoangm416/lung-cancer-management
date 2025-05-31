import { get } from "axios";

export function prepareOSGroupedData(
  data: any[],
  groupKey: string,
  ageBuckets?: number[]
): { group: string; data: { time: number; event: number; survival: number }[] }[] {
  /* Gom theo groupKey → mảng { time, event } */
  const raw: Record<string, { time: number; event: number }[]> = {};

  data.forEach((rec) => {
    const time = parseFloat(rec["OS.time"]);
    const event = parseInt(rec["OS"]); // 1 = tử vong, 0 = còn sống (censored)
    if (isNaN(time) || isNaN(event)) return;

    /* Xác định khóa nhóm */
    let key: string = rec[groupKey];

    /* Nếu phân nhóm tuổi */
    if (groupKey === "diagnosis_age" && ageBuckets) {
      const age = parseFloat(rec["diagnosis_age"]);
      if (isNaN(age)) return;
      let matched = false;
      for (let i = 0; i < ageBuckets.length - 1; i++) {
        const start = ageBuckets[i];
        const end = ageBuckets[i + 1];
        if (age >= start && age < end) {
          key = `${start}-${end}`;
          matched = true;
          break;
        }
      }

      // Nếu không khớp bucket nào → gán vào nhóm "cuối cùng+"
      if (!matched && age >= ageBuckets[ageBuckets.length - 1]) {
        key = `${ageBuckets[ageBuckets.length - 1]}+`;
      }
    }

    if (!key) return;
    if (!raw[key]) raw[key] = [];
    raw[key].push({ time, event });
  });

  /* Thứ tự ưu tiên cho nhóm Stage */
  const stageOrder = [
    "Stage I",
    "Stage IA",
    "Stage IB",
    "Stage II",
    "Stage IIA",
    "Stage IIB",
    "Stage IIIA",
    "Stage IIIB",
    "Stage IV",
  ];

  /* Sắp xếp nhóm đúng thứ tự */
  const groups = Object.entries(raw)
    .sort(([keyA], [keyB]) => {
      // Nếu là nhóm tuổi dạng "xx-yy"
      if (keyA.includes("-") && (keyB.includes("-") || keyB.endsWith("+"))) {
        const startA = getStartAge(keyA);
        const startB = getStartAge(keyB);
        return startA - startB;
      }

      // Nếu là nhóm Stage, sắp xếp theo thứ tự stageOrder
      const indexA = stageOrder.indexOf(keyA);
      const indexB = stageOrder.indexOf(keyB);
      const orderA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const orderB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return orderA - orderB;
    })
    .map(([group, rows]) => {
      // Sắp xếp các bản ghi trong nhóm theo thời gian tăng dần
      const sorted = rows.sort((a, b) => a.time - b.time);

      let atRisk = sorted.length;
      let survival = 1; // S(0) = 1
      const curve: { time: number; event: number; survival: number }[] = [];

      sorted.forEach(({ time, event }) => {
        if (event === 1) {
          survival *= (atRisk - 1) / atRisk;
        }
        curve.push({ time, event, survival });
        atRisk -= 1; // Bệnh nhân ra khỏi risk set dù sống hay chết
      });

      return { group, data: curve };
    });

  return groups;
}

export function prepareOSUngroupedData(
  data: any[]
): { group: string; data: { time: number; event: number; survival: number }[] }[] {
  const raw: { time: number; event: number }[] = [];

  data.forEach((rec) => {
    const time = parseFloat(rec["OS.time"]);
    const event = parseInt(rec["OS"]); // 1 = tử vong, 0 = còn sống (censored)
    if (isNaN(time) || isNaN(event)) return;
    raw.push({ time, event });
  });

  // Sắp xếp thời gian tăng dần
  const sorted = raw.sort((a, b) => a.time - b.time);

  let atRisk = sorted.length;
  let survival = 1;
  const curve: { time: number; event: number; survival: number }[] = [];

  sorted.forEach(({ time, event }) => {
    if (event === 1) {
      survival *= (atRisk - 1) / atRisk;
    }
    curve.push({ time, event, survival });
    atRisk -= 1;
  });

  return [{ group: "Overall Survival", data: curve }];
}

export function prepareDFSData(
  records: any[]
): { group: string; data: { time: number; event: number; survival: number }[] }[] {
  const raw: { time: number; event: number }[] = [];

  records.forEach((rec) => {
    const time = parseFloat(rec.disease_free_months ?? "");
    const status = rec.disease_free_status?.toLowerCase();

    if (isNaN(time) || !status) return;

    // Quy đổi status → event: "Recurred/Progressed" → event = 1, còn lại = 0
    const event = status.includes("recurred") || status.includes("progressed") ? 1 : 0;
    
    raw.push({ time: parseInt((time * 30).toFixed(0)), event }); // Chuyển đổi tháng sang ngày
  });

  // Sắp xếp tăng dần theo thời gian
  const sorted = raw.sort((a, b) => a.time - b.time);

  let atRisk = sorted.length;
  let survival = 1;
  const curve: { time: number; event: number; survival: number }[] = [];

  sorted.forEach(({ time, event }) => {
    if (event === 1) {
      survival *= (atRisk - 1) / atRisk;
    }
    curve.push({ time, event, survival });
    atRisk -= 1;
  });

  return [{ group: "Disease-Free Survival", data: curve }];
}

function getStartAge(key: string): number {
  if (key.includes("-")) {
    return parseInt(key.split("-")[0]);
  } else if (key.endsWith("+")) {
    return parseInt(key.slice(0, -1));
  }
  return NaN;
}
