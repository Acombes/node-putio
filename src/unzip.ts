import { access, mkdir, readdir, rm } from 'fs/promises';
import AdmZip from 'adm-zip';

export default async function unzip(
  directory: string,
  destination: string,
  options?: Partial<{
    cleanUp: boolean;
  }>
) {
  try {
    await access(destination);
  } catch (e) {
    await mkdir(destination, { recursive: true });
  }

  try {
    const files = await readdir(directory);
    if (files.length > 0) {
      files.forEach(file => {
        console.log(`Extracting ${file}`);
        const zip = new AdmZip(`${directory}/${file}`);
        zip.extractAllTo(destination, { overwrite: true });
        if (options?.cleanUp) {
          rm(`${directory}/${file}`);
          console.log(`Removed ${file} after extraction`);
        }
      });
    } else {
      throw new Error('No files');
    }
  } catch (e) {
    console.log(`Nothing to unzip at the specified location: ${directory}`);
    return;
  }
}
