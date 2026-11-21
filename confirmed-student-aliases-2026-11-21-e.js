/* MOVETE! Tanda 5: solo dos correcciones confirmadas.
   No se borran ni se descartan registros de entrenamiento. */
(function(){
 const fixes=new Map([
  ['alejandra travegl','Alejandra Travaglini'],
  ['alejandra travaglini','Alejandra Travaglini'],
  ['florencia rodrigu','Florencia Rodriguez'],
  ['florencia rodriguez','Florencia Rodriguez']
 ]);
 const key=n=>normalizeName(String(n||'')).replace(/\s+/g,' ');
 const slug=n=>key(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const [from,to] of fixes)aliases.set(from,to);
 for(const r of [...seed,...extra]){
  const to=fixes.get(key(r.student_name));
  if(to){r.student_name=to;r.student_key=slug(to);}
 }
 manualStudents=[...new Set(manualStudents.map(n=>fixes.get(key(n))||n))];
 localStorage.setItem('movete_records',JSON.stringify(extra));
 localStorage.setItem('movete_students',JSON.stringify(manualStudents));
 records=[...seed,...extra];renderHome();
})();