/* MOVETE! Reconstruccion: vista determinista, sin modificar el almacenamiento. */
(function(){
 'use strict';
 const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
 const day=v=>String(v||'').slice(0,10);
 const signature=r=>JSON.stringify([norm(r.student_name),norm(r.exercise),day(r.date),Number(r.weight_kg),Number(r.reps),Number(r.sets),norm(r.notes)]);
 const dedupe=items=>{const seen=new Set();return items.filter(r=>{if(!r||typeof r!=='object')return false;const k=signature(r);if(seen.has(k))return false;seen.add(k);return true;});};
 const canonical=new Map();
 for(const r of [...seed,...extra]){
  const name=String(r.student_name||'').trim();if(!name)continue;
  const k=norm(name);
  if(!canonical.has(k))canonical.set(k,name);
 }
 const cleaned=dedupe([...seed,...extra].map(r=>({...r,student_name:canonical.get(norm(r.student_name))||r.student_name})));
 records=cleaned;
 // Los alumnos manuales se conservan. La lista visible no depende de cuantas veces se abra.
 const students=new Map();
 for(const name of [...records.map(r=>r.student_name),...manualStudents]){
  const k=norm(name);if(k&&!students.has(k))students.set(k,canonical.get(k)||String(name).trim());
 }
 const fixedNames=[...students.values()].sort((a,b)=>a.localeCompare(b,'es'));
 const oldAllStudents=allStudents;
 // La función global es const: no se reasigna. Los nombres ya normalizados en records
 // mantienen una única identidad en el historial; manualStudents se normaliza en memoria.
 manualStudents=fixedNames.filter(n=>!records.some(r=>norm(r.student_name)===norm(n)));
 renderHome();
 window.MOVETE_DIAGNOSTICO=Object.freeze({version:'reconstruccion-2',originales:seed.length,guardados:extra.length,visibles:records.length,alumnos:allStudents().length,duplicadosOcultos:seed.length+extra.length-records.length});
})();
