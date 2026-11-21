/* MOVETE! - Unificaciones expresamente confirmadas. Sin borrar registros. */
(function(){
const fixes=new Map([
 ['carina vega','Carina Vega'],['cari vega','Carina Vega'],
 ['lorena nedelko','Lorena Nedelko'],['lore nedelko','Lorena Nedelko'],
 ['andrea brazuna','Andrea Brazuna'],['andre brazuna','Andrea Brazuna'],
 ['sabrina tusa','Sabrina Tusa'],['sabri tusa','Sabrina Tusa'],
 ['lili guerreiro','Lili Guerreiro'],['lili guerrerio','Lili Guerreiro'],
 ['matias grieco','Matías Grieco'],['marias grieco','Matías Grieco'],
 ['maria grieco','Matías Grieco']
]);
const key=n=>normalizeName(String(n||''));
const slug=n=>key(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const [from,to] of fixes)aliases.set(from,to);
for(const r of [...seed,...extra]){
 const to=fixes.get(key(r.student_name));
 if(to){r.student_name=to;r.student_key=slug(to);}
}
manualStudents=[...new Set(manualStudents.map(n=>fixes.get(key(n))||n))];
localStorage.setItem('movete_records',JSON.stringify(extra));
localStorage.setItem('movete_students',JSON.stringify(manualStudents));
records=[...seed,...extra];
renderHome();
})();