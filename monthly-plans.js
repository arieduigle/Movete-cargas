/* MOVETE! Planificación mensual individual. Datos locales, sin modificar historiales. */
(function(){
'use strict';
const STORE='movete_monthly_plans_v1';
const exercises=['Sentadilla','Peso Muerto','Trap Bar','Banco Plano','Good Morning','Hip Thrust'];
const key=n=>String(n).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
const safe=s=>esc(String(s));
const month=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const read=()=>{try{const data=JSON.parse(localStorage.getItem(STORE)||'{}');return data&&typeof data==='object'?data:{}}catch{return {}}};
const write=data=>localStorage.setItem(STORE,JSON.stringify(data));
const originalProfile=profile;
profile=function(name){originalProfile(name);draw(name)};
function draw(name){
 const host=document.querySelector('#profile');if(!host)return;
 const section=document.createElement('section');section.className='card';section.id='monthlyPlan';
 section.innerHTML='<h2>Plan mensual de fuerza</h2><p class="meta">Objetivos semanales por alumno · Guardados en este celular</p>'+
 '<label for="planMonth">Mes</label><input id="planMonth" type="month" value="'+month()+'">'+
 '<label for="planWeeks">Semanas del plan</label><select id="planWeeks"><option value="4">4 semanas</option><option value="5">5 semanas</option></select>'+
 '<div id="planRows"></div><div class="row"><button type="button" class="ghost" id="planAdd">+ Ejercicio</button></div>'+
 '<div class="row"><button type="button" class="primary" id="planSave">Guardar plan</button><button type="button" class="ghost" id="planShare">Compartir WhatsApp</button><button type="button" class="ghost" id="planCalendar">Google Calendar · domingos 19 h</button></div>'+
 '<p class="meta" id="planStatus">Cargas objetivo en kg. Las semanas sin entrenamiento pueden quedar vacías.</p><div id="planProgress"></div>';
 host.appendChild(section);
 const $=s=>section.querySelector(s);
 const rows=()=>Array.from(section.querySelectorAll('.planRow'));
 const status=t=>{$('#planStatus').textContent=t};
 function updateWeeks(){const five=$('#planWeeks').value==='5';rows().forEach(r=>{const input=r.querySelectorAll('.planWeek')[4];if(input)input.parentElement.style.display=five?'':'none'})}
 function addRow(ex='Sentadilla',values=[]){
  const div=document.createElement('div');div.className='card planRow';
  const choices=exercises.includes(ex)?exercises:[...exercises,ex];
  div.innerHTML='<div class="row"><select class="planExercise">'+choices.map(x=>'<option value="'+safe(x)+'"'+(x===ex?' selected':'')+'>'+safe(x)+'</option>').join('')+'</select><button type="button" class="ghost planRemove">Quitar</button></div>'+
   '<div class="row" style="flex-wrap:wrap">'+Array.from({length:5},(_,i)=>'<div style="min-width:55px;flex:1"><label>S'+(i+1)+'</label><input class="planWeek" type="number" min="0" step="0.5" inputmode="decimal" placeholder="kg" value="'+(values[i]??'')+'"></div>').join('')+'</div>';
  $('#planRows').appendChild(div);div.querySelector('.planRemove').onclick=()=>{div.remove();updateWeeks()};updateWeeks();
 }
 function collect(){
  const plan={};const count=Number($('#planWeeks').value);
  rows().forEach(r=>{const ex=r.querySelector('.planExercise').value;const values=Array.from(r.querySelectorAll('.planWeek')).slice(0,count).map(el=>el.value.trim()===''?null:Number(el.value));
   if(values.some(v=>v!==null&&(!Number.isFinite(v)||v<0)))throw Error('Revisá las cargas ingresadas.');
   if(plan[ex])throw Error('Hay ejercicios repetidos. Elegí cada ejercicio una sola vez.');
   plan[ex]=values;
  });return plan;
 }
 function savedPlan(){return read()[key(name)]?.[$('#planMonth').value]||{}}
 function renderProgress(){
  const plan=savedPlan(),m=$('#planMonth').value;const output=[];
  Object.entries(plan).forEach(([ex,values])=>{
   if(!Array.isArray(values))return;
   const items=values.map((target,i)=>{
    if(target===null||target===undefined||target==='')return '';
    const entries=records.filter(r=>key(r.student_name)===key(name)&&key(r.exercise)===key(ex)&&String(r.date).slice(0,7)===m&&Math.floor((Number(String(r.date).slice(8,10))-1)/7)===i&&Number.isFinite(Number(r.weight_kg))).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    if(!entries.length)return 'S'+(i+1)+': Pendiente · '+target+' kg';
    const actual=Number(entries[0].weight_kg),goal=Number(target);
    return 'S'+(i+1)+': '+(actual>=goal?'Cumplido':'En progreso')+' · '+actual+' / '+goal+' kg';
   }).filter(Boolean);
   if(items.length)output.push('<div class="card"><strong>'+safe(ex)+'</strong><div class="meta">'+items.map(safe).join('<br>')+'</div></div>');
  });
  $('#planProgress').innerHTML='<h3>Seguimiento semanal</h3>'+(output.join('')||'<p class="meta">Guardá los objetivos para ver el seguimiento.</p>');
 }
 function load(){
  $('#planRows').innerHTML='';
  const plan=savedPlan();const values=Object.entries(plan).filter(([,v])=>Array.isArray(v));
  $('#planWeeks').value=values.some(([,v])=>v.length===5)?'5':'4';
  if(values.length)values.forEach(([ex,v])=>addRow(ex,v));else addRow();
  updateWeeks();renderProgress();
 }
 function save(){
  try{const data=read(),student=key(name),m=$('#planMonth').value;if(!m)throw Error('Elegí un mes.');
   data[student] ||= {};data[student][m]=collect();write(data);status('Plan guardado en este celular.');renderProgress();return true;
  }catch(e){status('No se pudo guardar: '+e.message);return false}
 }

 // Exportación de recordatorios semanales; no modifica alumnos ni registros.
 function calendarExport(){
  if(!save())return;
  const m=$('#planMonth').value,plan=savedPlan();
  const [year,monthNumber]=m.split('-').map(Number);
  const count=Number($('#planWeeks').value);
  const first=new Date(Date.UTC(year,monthNumber-1,1));
  const firstMonday=new Date(first);
  firstMonday.setUTCDate(first.getUTCDate()-((first.getUTCDay()+6)%7));
  const pad=n=>String(n).padStart(2,'0');
  const stamp=d=>d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  const monthLabel=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(new Date(year,monthNumber-1,1));
  const lines=['💚 *MOVETE! · Entrenar es salud*','','📅 *Recordatorios de fuerza · '+monthLabel+'*','👤 *Alumno:* '+name,'','Agregá cada semana a tu Google Calendar tocando su enlace:'];
  for(let i=0;i<count;i++){
   const sunday=new Date(firstMonday);
   sunday.setUTCDate(firstMonday.getUTCDate()+i*7-1);
   sunday.setUTCHours(22,0,0,0); // Domingo 19:00 Argentina
   const end=new Date(sunday.getTime()+15*60000);
   const targets=Object.entries(plan).filter(([,v])=>Array.isArray(v)&&v[i]!==null&&v[i]!==undefined&&v[i]!=='').map(([ex,v])=>ex+': '+(Number(v)===0?'Sin carga programada':String(v).replace('.',',')+' kg'));
   const firstName=String(name).trim().split(/\s+/)[0]||'alumno';
   const description=['¡Hola, '+firstName+'! 💪','','Estos son tus objetivos de fuerza para esta semana.','',...(targets.length?targets:['Sin cargas programadas']),'','Recordá que buscamos progresar semana a semana, priorizando la técnica y la calidad del movimiento.','','Las cargas son orientativas y pueden ajustarse según tu evolución.','','MOVETE! · Entrenar es salud 💚'].join('\n');
   const url='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:'MOVETE! 💚 | Objetivos de fuerza · Semana '+(i+1),dates:stamp(sunday)+'/'+stamp(end),details:description,ctz:'America/Argentina/Buenos_Aires'}).toString();
   lines.push('','*Semana '+(i+1)+' · Domingo 19:00*',...targets,url);
  }
  lines.push('','Cada enlace abre Google Calendar para confirmar el recordatorio. No se agregan eventos automáticamente.');
  window.open('https://wa.me/?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
  status('Se abrió WhatsApp con los enlaces de Google Calendar para '+count+' semanas. El alumno debe confirmar cada evento.');
 }
 $('#planCalendar').onclick=calendarExport;
 $('#planMonth').onchange=load;
 $('#planWeeks').onchange=updateWeeks;
 $('#planAdd').onclick=()=>addRow();
 $('#planSave').onclick=save;
 $('#planShare').onclick=()=>{
  if(!save())return;
  const plan=savedPlan(),m=$('#planMonth').value;
  const firstName=String(name).trim().split(/\s+/)[0]||'';
  const [year,monthNumber]=m.split('-').map(Number);
  const monthLabel=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(new Date(year,monthNumber-1,1));
  const lines=['💚 *MOVETE! · Entrenar es salud*','', '¡Hola, '+firstName+'! 💪','Te compartimos tus objetivos de fuerza para este mes. La idea es seguir progresando semana a semana, respetando tus tiempos y tu evolución.','', '📅 *Plan de fuerza · '+monthLabel.charAt(0).toUpperCase()+monthLabel.slice(1)+'*','👤 *Alumno:* '+name];
  Object.entries(plan).forEach(([ex,vals])=>{if(!Array.isArray(vals))return;lines.push('','🏋️ *'+ex+'*');vals.forEach((v,i)=>{if(v!==null&&v!==undefined&&v!=='')lines.push('Semana '+(i+1)+': '+(Number(v)===0?'Sin carga programada':String(v).replace('.',',')+' kg'))})});
  lines.push('','🎯 *Importante:* Las cargas son objetivos orientativos y pueden ajustarse según tu evolución y respuesta al entrenamiento.','','*¡Seguimos trabajando para superarnos! 💚*');
  const message=lines.join('\n');const url='https://wa.me/?text='+encodeURIComponent(message);
  window.open(url,'_blank','noopener');
 };
 load();
}
})();
