/* MOVETE! Tanda 4: únicamente Eve = Evelyn Wasinger.
   Los otros cinco pares fueron confirmados como personas diferentes. */
(function(){
 const key=n=>normalizeName(String(n||'')).replace(/\s+/g,' ');
 const target='Evelyn Wasinger';
 aliases.set('eve',target);
 aliases.set('evelyn wasinger',target);
 const slug=key(target).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const r of [...seed,...extra]){
  if(key(r.student_name)==='eve'||key(r.student_name)==='evelyn wasinger'){
   r.student_name=target;r.student_key=slug;
  }
 }
 manualStudents=[...new Set(manualStudents.map(n=>(key(n)==='eve'||key(n)==='evelyn wasinger')?target:n))];
 
 
 records=[...seed,...extra];renderHome();
})();