/* MOVETE! Reparación de duplicados: idempotente en cada inicio. */
(function(){
 'use strict';
 const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
 const signature=r=>JSON.stringify([norm(r.student_name),norm(r.exercise),String(r.date||''),Number(r.weight_kg),Number(r.reps),Number(r.sets),norm(r.notes)]);
 const dedupe=arr=>{const seen=new Set();return arr.filter(r=>{if(!r||typeof r!=='object')return false;const k=signature(r);if(seen.has(k))return false;seen.add(k);return true})};
 // No agregar datos del servidor al almacenamiento local: guardar solo los registros ingresados.
 const cleaned=dedupe(extra);
 if(cleaned.length!==extra.length){extra=cleaned;localStorage.setItem('movete_records',JSON.stringify(extra));}
 records=dedupe([...seed,...extra]);
 renderHome();
})();
