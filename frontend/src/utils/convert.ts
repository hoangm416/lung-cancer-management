import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Convert SVS file to DZI using pyvips via CLI
 */
export function convertSvsToDzi(
  svsPath: string,
  outputPrefix: string,
  tileSize: number = 256,
  overlap: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(svsPath)) {
      return reject(new Error(`SVS file not found: ${svsPath}`));
    }

    const dir = path.dirname(outputPrefix);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const command = `vips dzsave "${svsPath}" "${outputPrefix}" --tile-size ${tileSize} --overlap ${overlap}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Failed to convert SVS to DZI:\n${stderr}`));
      } else {
        resolve();
      }
    });
  });
}
