/* MOVETE! - Correcciones confirmadas 21/11/2026. Conserva todas las cargas. */
(function(){
const fixes=new Map([
 ["julueta grillanini","Julieta Grillanini"],
 ["macicel amat","Maricel Amat"],
 ["anabela gimebez","Anabela Giménez"],
 ["marias grieco","María Grieco"]
]);
for(const [from,to] of fixes) aliases.set(from,to);
const slug=n=>normalizeName(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const record of [...seed,...extra]){
 const canonical=fixes.get(normalizeName(record.student_name));
 if(canonical){record.student_name=canonical;record.student_key=slug(canonical);}
}
manualStudents=[...new Set(manualStudents.map(n=>fixes.get(normalizeName(n))||n))];


records=[...seed,...extra];
renderHome();
})();