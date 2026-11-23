/* MOVETE! Vista limpia aislada. Conserva originales en almacenamiento local. */
(function(){
 'use strict';
 const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
 const signature=r=>JSON.stringify([norm(r.student_name),norm(r.exercise),String(r.date||'').slice(0,10),Number(r.weight_kg),Number(r.reps),Number(r.sets),norm(r.notes)]);
 const dedupe=arr=>{const seen=new Set();return arr.filter(r=>{if(!r||typeof r!=='object')return false;const key=signature(r);if(seen.has(key))return false;seen.add(key);return true;});};
 // No se modifica localStorage: no borrar datos ni planes antes de verificar.
 records=dedupe([...seed,...extra]);
 renderHome();
 window.MOVETE_DIAGNOSTICO=Object.freeze({version:'reconstruccion-1',seed:seed.length,guardados:extra.length,visibles:records.length,alumnos:allStudents().length});
})();
