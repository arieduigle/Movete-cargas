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
 function progress(){const root=section.querySelector('#planProgress');const m=section.querySelector('#planMonth').value;const plan=read()[key(name)]?.[m]||{};const out=[];Object.entries(plan).forEach(([ex,vals])=>{if(!Array.isArray(vals))return;const weeks=[];vals.forEach((target,i)=>{if(target===null||target===undefined||target==='')return;const entries=records.filter(r=>key(r.student_name)===key(name)&&key(r.exercise)===key(ex)&&String(r.date).slice(0,7)===m&&Math.floor((Number(String(r.date).slice(8,10))-1)/7)===i&&Number.isFinite(Number(r.weight_kg))).sort((a,b)=>String(b.date).localeCompare(String(a.date)));if(!entries.length){weeks.push('S'+(i+1)+': Pendiente');return;}const actual=Number(entries[0].weight_kg),goal=Number(target);weeks.push('S'+(i+1)+': '+(actual>goal?'↑ Superado':actual===goal?'✓ Cumplido':'↓ Por debajo')+' ('+actual+' / '+goal+' kg)');});if(weeks.length)out.push('<div class="card"><strong>'+safe(ex)+'</strong><div class="meta">'+weeks.map(safe).join('<br>')+'</div></div>');});root.innerHTML=out.length?'<h3>Seguimiento semanal</h3><p class="meta">S1: días 1–7 · S2: 8–14 · S3: 15–21 · S4: 22–28 · S5: 29–fin de mes. Se compara el último registro de cada período.</p>'+out.join(''):'';}
 function load(){section.querySelector('#planRows').innerHTML='';const data=read()[key(name)]?.[section.querySelector('#planMonth').value]||{};const hasFive=Object.values(data).some(v=>Array.isArray(v)&&v.length===5);section.querySelector('#planWeeks').value=hasFive?'5':'4';Object.entries(data).forEach(([ex,v])=>addRow(ex,v));if(!Object.keys(data).length)addRow('Sentadilla');updateWeeks();progress();}
 function collect(){const data={};let invalid=false;section.querySelectorAll('.planRow').forEach(row=>{const ex=row.querySelector('.planExercise').value;if(data[ex]){invalid=true;return;}const vals=[...row.querySelectorAll('.planWeek')].slice(0,Number(section.querySelector('#planWeeks').value)).map(el=>el.value===''?null:Number(el.value));if(vals.some(v=>v!==null&&(!Number.isFinite(v)||v<0)))invalid=true;data[ex]=vals;});return invalid?null:data;}
 function save(){const data=collect();if(!data){alert('Revisá los pesos o los ejercicios repetidos.');return null;}const all=read(),k=key(name),m=section.querySelector('#planMonth').value;if(!m){alert('Elegí un mes.');return null;}if(!all[k])all[k]={};all[k][m]=data;try{localStorage.setItem(STORE,JSON.stringify(all));section.querySelector('#planStatus').textContent='Plan guardado en este dispositivo.';progress();return data;}catch{alert('No se pudo guardar el plan.');return null;}}
 section.querySelector('#planMonth').onchange=load;
 section.querySelector('#planWeeks').onchange=updateWeeks;
 section.querySelector('#planAdd').onclick=()=>addRow(exercises.find(x=>![...section.querySelectorAll('.planExercise')].some(s=>s.value===x))||exercises[0]);
 section.querySelector('#planSave').onclick=save;
 section.querySelector('#planShare').onclick=()=>{
  const data=save();if(!data)return;
  const m=section.querySelector('#planMonth').value;
  const lines=['💚 MOVETE! · Entrenar es salud','Plan de fuerza · '+m,'Alumno: '+name,''];
  Object.entries(data).forEach(([ex,vals])=>{if(vals.every(v=>v===null))return;lines.push(ex);vals.forEach((v,i)=>{if(v!==null)lines.push('Semana '+(i+1)+': '+v+' kg');});lines.push('');});
  lines.push('Objetivos orientativos sujetos a la evolución del entrenamiento.');
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
 };
 load();
}
})();