/* MOVETE! Planes mensuales individuales, guardados en este dispositivo. */
(function(){
const STORE='movete_monthly_plans_v1';
const exercises=['Sentadilla','Peso Muerto','Trap Bar','Banco Plano','Good Morning','Hip Thrust'];
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
const key=n=>normalizeName(n).replace(/\s+/g,' ');
const safe=s=>esc(String(s));
const month=()=>new Date().toISOString().slice(0,7);
let current='';
const originalProfile=profile;
profile=function(name){originalProfile(name);current=name;draw(name);};
function draw(name){
 const host=document.querySelector('#profile');if(!host)return;
 const all=read(),m=month(),saved=all[key(name)]?.[m]||{};
 const section=document.createElement('section');section.className='card';section.id='monthlyPlan';
 section.innerHTML='<h2>Plan mensual de fuerza</h2><p class="meta">Objetivos semanales orientativos · Se guardan en este celular</p>'+
 '<label>Mes</label><input id="planMonth" type="month" value="'+m+'">'+
 '<label>Semanas del plan</label><select id="planWeeks"><option value="4">4 semanas</option><option value="5">5 semanas</option></select>'+ '<div id="planRows"></div><div id="planProgress"></div><div class="row"><button type="button" class="ghost" id="planAdd">+ Ejercicio</button></div>'+
 '<div class="row"><button type="button" class="primary" id="planSave">Guardar plan</button><button type="button" class="ghost" id="planShare">Compartir WhatsApp</button></div>'+
 '<p class="meta" id="planStatus">Cargas en kg. Dejá vacía una semana si no corresponde trabajarla.</p>';
 host.appendChild(section);
 function addRow(ex='',values=[]){
  const div=document.createElement('div');div.className='card planRow';
  div.innerHTML='<div class="row"><select class="planExercise">'+exercises.concat(ex&&!exercises.includes(ex)?[ex]:[]).map(x=>'<option value="'+safe(x)+'" '+(x===ex?'selected':'')+'>'+safe(x)+'</option>').join('')+'</select><button type="button" class="ghost planRemove">Quitar</button></div>'+
  '<div class="row">'+[0,1,2,3,4].map(i=>'<div><label>S'+(i+1)+'</label><input class="planWeek" type="number" min="0" step="0.5" inputmode="decimal" placeholder="kg" value="'+(values[i]??'')+'"></div>').join('')+'</div>';
  section.querySelector('#planRows').appendChild(div);
  div.querySelector('.planRemove').onclick=()=>div.remove(); updateWeeks();
 }
 function updateWeeks(){const five=section.querySelector('#planWeeks').value==='5';section.querySelectorAll('.planRow').forEach(row=>{const last=row.querySelectorAll('.planWeek')[4];if(last)last.parentElement.style.display=five?'':'none';});}
 function progress(){const root=section.querySelector('#planProgress');const m=section.querySelector('#planMonth').value;const plan=read()[key(name)]?.[m]||{};const out=[];Object.entries(plan).forEach(([ex,vals])=>{if(!Array.isArray(vals))return;const weeks=[];vals.forEach((target,i)=>{if(target===null||target===undefined||target==='')return;const entries=records.filter(r=>key(r.student_name)===key(name)&&key(r.exercise)===key(ex)&&String(r.date).slice(0,7)===m&&Math.floor((Number(String(r.date).slice(8,10))-1)/7)===i&&Number.isFinite(Number(r.weight_kg))).sort((a,b)=>String(b.date).localeCompare(String(a.date)));if(!entries.length){weeks.push('S'+(i+1)+': Pendiente');return;}const actual=Number(entries[0].weight_kg),goal=Number(target);weeks.push('S'+(i+1)+': '+(actual>goal?'↑ Superado':actual===goal?'✓ Cumplido':'↓ Por debajo')+' ('+actual+' / '+goal+' kg)');});if(weeks.length)out.push('<div class="card"><strong>'+safe(ex)+'</strong><div class="meta">'+weeks.map(safe).join('<br>')+'</div></div>');});root.innerHTML='<h3>Seguimiento semanal</h3><p class="meta">Comparación de objetivos con el último registro de cada semana (días 1–7, 8–14, 15–21, 22–28 y 29–fin de mes).</p>'+(out.length?out.join(''):'<div class="note">Todavía no hay objetivos guardados para este mes. Completá las cargas de arriba y tocá Guardar plan para ver el seguimiento.</div>');