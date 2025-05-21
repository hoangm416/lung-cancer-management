export type OSDataRow = {
  sample: string;
  'OS.time': string;
  OS: string;
  _PATIENT: string;
};

export function loadTSV(path: string): Promise<OSDataRow[]> {
  return fetch(path)
    .then((res) => res.text())
    .then((text) => {
      const lines = text.trim().split("\n");
      const headers = lines[0].trim().split("\t").map((h) => h.trim());

      const data: OSDataRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split("\t").map((v) => v.trim());
        const row: Record<string, string> = {};

        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });

        if (!row._PATIENT) {
          console.warn("⚠️ Line", i + 1, "missing _PATIENT", row);
        }

        data.push(row as OSDataRow);
      }

      const uniqueData = Object.values(
        data.reduce((acc, row) => {
          acc[row._PATIENT] = row; // Lấy bản ghi cuối
          return acc;
        }, {} as Record<string, OSDataRow>)
      );

      console.log(`✅ TSV loaded, unique patients: ${uniqueData.length}`);
      return uniqueData;
    });
}
