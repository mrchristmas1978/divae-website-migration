// Merge one archetype subagent result (stardust/replica/results/<type>.json) into progress.json types.<type>.
import fs from 'node:fs';
const type = process.argv[2];
const res = JSON.parse(fs.readFileSync(`stardust/replica/results/${type}.json`, 'utf8'));
const p = JSON.parse(fs.readFileSync('stardust/replica/progress.json', 'utf8'));
p.types ??= {};
p.types[type] = { ...(p.types[type] || {}), ...res };
fs.writeFileSync('stardust/replica/progress.json', JSON.stringify(p, null, 2) + '\n');
console.log(`merged ${type}: archetype=${res.archetype} passed=${res.passed}`);
