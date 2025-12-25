import { execSync } from 'child_process';

const checkCommand = (command: string, name: string) => {
    try {
        const version = execSync(`${command} --version`, { encoding: 'utf8' }).trim();
        console.log(`✅ ${name} found: ${version}`);
    } catch (error) {
        console.warn(`⚠️  ${name} not found or error checking version.`);
    }
};

console.log('Verifying development environment...');
checkCommand('node', 'Node.js');
checkCommand('npm', 'npm');
checkCommand('docker', 'Docker');

const recommendedNode = '>=18';
console.log(`\nRecommended Node version: ${recommendedNode}`);
