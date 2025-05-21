import fs from 'fs';
import path from 'path';

let __dirname = import.meta.dirname;
let dllPath = path.join(__dirname, 'node_modules', '@tensorflow', 'tfjs-node', 'deps', 'lib', 'tensorflow.dll');
let dllDestDir = path.join(__dirname, 'node_modules', '@tensorflow', 'tfjs-node', 'lib', 'napi-v8');
let dllDestPath = path.join(dllDestDir, 'tensorflow.dll');

if (!fs.existsSync(dllDestPath) && fs.existsSync(dllPath)) {
    fs.copyFileSync(dllPath, dllDestPath);
    console.log('tensorflow.dll copied.');
}
