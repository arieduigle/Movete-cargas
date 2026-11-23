/* MOVETE! - Tanda 3: ocho identidades confirmadas por el usuario.
   Conserva cada registro, fecha, ejercicio y carga; no elimina datos. */
(function(){
 const fixes=new Map([
  ['anabela gimebez','Anabella Jiménez'],
  ['anabela gimenez','Anabella Jiménez'],
  ['anabella jimenez','Anabella Jiménez'],
  ['fer abegnale','Fernanda Abegnale'],
  ['fernanda abegna','Fernanda Abegnale'],
  ['fernanda abegnale','Fernanda Abegnale'],
  ['flor casares','Flor Placeres'],
  ['flor placeres','Flor Placeres'],
  ['guillermo bragag','Guillermo Bragagnolo'],
  ['guillermo bragagnolo','Guillermo Bragagnolo'],
  ['nazareno maldon','Nazareno Maldonado'],
  ['nazareno maldonado','Nazareno Maldonado'],
  ['sol basili','Sol Basili'],
  ['sol bassillo','Sol Basili'],
  ['rosalia','Rosalia Boully'],
  ['rosalia boully','Rosalia Boully'],
  ['francesca','Francesca Reimundo'],
  ['francesca reimundo','Francesca Reimundo']
 ]);
 const key=n=>normalizeName(String(n||'')).replace(/\s+/g,' ');
 const slug=n=>key(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const [from,to] of fixes)aliases.set(from,to);
 for(const r of [...seed,...extra]){
  const to=fixes.get(key(r.student_name));
  if(to){r.student_name=to;r.student_key=slug(to);}
 }
 manualStudents=[...new Set(manualStudents.map(n=>fixes.get(key(n))||n))];
 
 
 records=[...seed,...extra];
 renderHome();
})();