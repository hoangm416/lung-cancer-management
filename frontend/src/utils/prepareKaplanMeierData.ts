import { get } from "axios";

export function prepareOSGroupedData(
  data: any[],
  groupKey: string,
  ageBuckets?: number[]
): { group: string; data: { time: number; event: number; survival: number }[] }[] {
  /* Gom theo groupKey → mảng { time, event } */
  const raw: Record<string, { time: number; event: number }[]> = {};

  data.forEach((rec) => {
    const time = parseInt((rec["overall_survival_months"] * 30.4).toFixed(0)); // Chuyển đổi tháng sang ngày
    let event // 1 = tử vong, 0 = còn sống (censored)
    if (rec["vital_status"]?.toLowerCase() === "dead") {
      event = 1;
    } else event = 0
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

  const stageMOrder = ["M0", "M1", "M1a", "M1b", "MX"];

  const stageNOrder = ["N0", "N1", "N2", "N3", "NX"];

  const stageTOrder = ["T1", "T1a", "T1b", "T2", "T2a", "T2b", "T3", "T4", "TX"];

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
      if (indexA !== -1 || indexB !== -1) {
        const orderA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
        const orderB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
        return orderA - orderB;
      }

      // Nếu là nhóm M, sắp xếp theo thứ tự stageMOrder
      const mA = stageMOrder.indexOf(keyA);
      const mB = stageMOrder.indexOf(keyB);
      if (mA !== -1 || mB !== -1) {
        const orderA = mA === -1 ? Number.MAX_SAFE_INTEGER : mA;
        const orderB = mB === -1 ? Number.MAX_SAFE_INTEGER : mB;
        return orderA - orderB;
      }

      // Nhóm theo Stage N
      const nA = stageNOrder.indexOf(keyA);
      const nB = stageNOrder.indexOf(keyB);
      if (nA !== -1 || nB !== -1) {
        const orderA = nA === -1 ? Number.MAX_SAFE_INTEGER : nA;
        const orderB = nB === -1 ? Number.MAX_SAFE_INTEGER : nB;
        return orderA - orderB;
      }

      // Nhóm theo Stage T
      const tA = stageTOrder.indexOf(keyA);
      const tB = stageTOrder.indexOf(keyB);
      if (tA !== -1 || tB !== -1) {
        const orderA = tA === -1 ? Number.MAX_SAFE_INTEGER : tA;
        const orderB = tB === -1 ? Number.MAX_SAFE_INTEGER : tB;
        return orderA - orderB;
      }

      // Mặc định: sắp xếp theo chữ cái
      return keyA.localeCompare(keyB);
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
    const time = parseInt((rec["overall_survival_months"] * 30.4).toFixed(0)); // Chuyển đổi tháng sang ngày
    let event // 1 = tử vong, 0 = còn sống (censored)
    if (rec["vital_status"]?.toLowerCase() === "dead") {
      event = 1;
    } else event = 0
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
  console.log("OS Ungrouped Data:", curve);
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
    
    raw.push({ time: parseInt((time * 30.4).toFixed(0)), event }); // Chuyển đổi tháng sang ngày
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
