/* Confirmed MOVETE student identity aliases. No records are deleted. */
(function(){
const confirmed = new Map([["ana idalgo","Ana Hidalgo"],["ana hidalgo","Ana Hidalgo"],["leo berteli","Leo Bertelli"],["leo bertelli","Leo Bertelli"],["seba basilli","Sebastián Basilli"],["sebastian basilli","Sebastián Basilli"],["sil vasquez","Silvana Vasques"],["silvana vasquez","Silvana Vasques"],["silvana vasques","Silvana Vasques"],["ines vazques","Inez Vasques"],["inez vasques","Inez Vasques"],["oli vega","Olivia Vega"],["olivia vega","Olivia Vega"],["lau avila","Laura Avila"],["laura avila","Laura Avila"],["mercedes alcanta","Mercedes Alcántara"],["mercedes alcantara","Mercedes Alcántara"],["susana fernande","Susana Fernández"],["susana fernandez","Susana Fernández"]]);
for(const [from,to] of confirmed) aliases.set(from,to);
const slug = name => normalizeName(name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const record of [...seed,...extra]){
 const canonical=confirmed.get(normalizeName(record.student_name));
 if(canonical){record.student_name=canonical;record.student_key=slug(canonical);}
}
manualStudents=[...new Set(manualStudents.map(n=>confirmed.get(normalizeName(n))||n))];
localStorage.setItem('movete_records',JSON.stringify(extra));
localStorage.setItem('movete_students',JSON.stringify(manualStudents));
records=[...seed,...extra];
renderHome();
})();
