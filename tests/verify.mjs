import fs from 'node:fs';
import assert from 'node:assert/strict';
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1].split('?')[0]);
for(const file of scripts)assert.ok(fs.existsSync(file),'Falta el archivo: '+file);
assert.equal(scripts.at(-1),'stable-view.js','La normalización final debe correr al final');
assert.ok(scripts.indexOf('monthly-plans.js')<scripts.indexOf('stable-view.js'));
const app=fs.readFileSync('app.js','utf8');
const exportFn=app.slice(app.indexOf('function exportBackup()'),app.indexOf('function importBackup()'));
assert.ok(!/seed\.push|extra\.push|records\s*=/.test(exportFn),'Exportar no debe cambiar registros');
assert.ok(exportFn.includes('monthly_plans'),'El respaldo debe incluir planes');
for(const file of scripts.filter(x=>x.includes('alias')||x.includes('identities'))){
 const source=fs.readFileSync(file,'utf8');
 assert.ok(!source.includes("localStorage.setItem('movete_records'"),'Alias reescribe registros: '+file);
}
const stable=fs.readFileSync('stable-view.js','utf8');
assert.ok(stable.includes('dedupe('));
console.log('Verificación estática OK: '+scripts.length+' módulos');
