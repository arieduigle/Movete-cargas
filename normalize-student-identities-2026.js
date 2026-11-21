/* MOVETE! Normalización de identidad: mayúsculas, tildes y espacios.
   No elimina registros; respeta los alias confirmados previamente. */
(function(){
 const key = n => normalizeName(String(n||''));
 const canonical = new Map();
 const preferred = n => String(n).trim().replace(/\s+/g,' ').replace(/\b\p{L}/gu,c=>c.toLocaleUpperCase('es-AR'));
 for(const n of [...seed,...extra].map(r=>r.student_name).concat(manualStudents)){
   const k=key(n);if(!k)continue;
   const mapped=aliases.get(k);
   if(mapped){canonical.set(k,mapped);continue;}
   const candidate=preferred(n);
   if(!canonical.has(k))canonical.set(k,candidate);
   else if(/[ÁÉÍÓÚÑáéíóúñ]/.test(candidate)&&!/[ÁÉÍÓÚÑáéíóúñ]/.test(canonical.get(k)))canonical.set(k,candidate);
 }
 const slug=n=>key(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const r of [...seed,...extra]){
   const target=canonical.get(key(r.student_name));
   if(target){r.student_name=target;r.student_key=slug(target);}
 }
 manualStudents=[...new Set(manualStudents.map(n=>canonical.get(key(n))||n))];
 localStorage.setItem('movete_records',JSON.stringify(extra));
 localStorage.setItem('movete_students',JSON.stringify(manualStudents));
 records=[...seed,...extra];renderHome();
})();