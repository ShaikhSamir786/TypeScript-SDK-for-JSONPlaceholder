import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const dirsToClean = ['dist', 'coverage'];

dirsToClean.forEach(dir => {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`Cleaning ${dir}...`);
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Cleaned ${dir}`);
    } else {
        console.log(`${dir} does not exist, skipping.`);
    }
});
